// Song duration in seconds, read from the "data-song-duration" attribute of the <body>.
// Durations are taken from Spotify (Hadestown Original Broadway Cast Recording).
var songDuration;
var scrollSpeed;
var animationFrameId = null;
var startTime;
var startScrollY;

var PLAY_ICON_PATH = "M8 5v14l11-7z";
var STOP_ICON_PATH = "M6 6h12v12H6z";

function onLoad() {
    songDuration = parseFloat(document.body.dataset.songDuration);
    document.getElementById("playButton").addEventListener("click", togglePlay);
    document.getElementById("goToStartButton").addEventListener("click", goToStart);
}

function togglePlay() {
    if (animationFrameId !== null) {
        stop();
    } else {
        play();
    }
}

function updatePlayButton(isPlaying) {
    var playButton = document.getElementById("playButton");
    playButton.title = isPlaying ? "Stop" : "Play";
    playButton.querySelector("path").setAttribute("d", isPlaying ? STOP_ICON_PATH : PLAY_ICON_PATH);
}

function getMaxScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
}

function play() {
    if (animationFrameId !== null) {
        return;
    }
    // The speed is chosen so that scrolling the whole page takes as long as the song,
    // so starting from the middle of the page keeps the same pace.
    scrollSpeed = getMaxScroll() / songDuration;
    startTime = performance.now();
    startScrollY = window.scrollY;
    animationFrameId = requestAnimationFrame(scrollStep);
    updatePlayButton(true);
}

function scrollStep(now) {
    var elapsedSeconds = (now - startTime) / 1000;
    var targetScrollY = Math.min(startScrollY + scrollSpeed * elapsedSeconds, getMaxScroll());
    window.scrollTo(0, targetScrollY);
    if (targetScrollY >= getMaxScroll()) {
        animationFrameId = null;
        updatePlayButton(false);
        return;
    }
    animationFrameId = requestAnimationFrame(scrollStep);
}

function stop() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    updatePlayButton(false);
}

function goToStart() {
    stop();
    window.scrollTo({ top: 0, behavior: "smooth" });
}
