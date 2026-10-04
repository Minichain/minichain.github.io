// Song duration in seconds, read from the "data-song-duration" attribute of the <body>.
// Durations are taken from Spotify (Hadestown Original Broadway Cast Recording).
var songDuration;
var scrollSpeed;
var animationFrameId = null;
var isPlaying = false;

// Position the auto scroll is at in "baseTime", without the smooth skip animation applied.
var baseTime;
var baseScrollY;

// Smooth skip animation: the page starts "skipOffset" pixels away from the base position
// and the offset eases to 0 in SKIP_ANIMATION_MS.
var isSkipping = false;
var skipStartTime;
var skipOffset;

var PLAY_ICON_PATH = "M8 5v14l11-7z";
var STOP_ICON_PATH = "M6 6h12v12H6z";
var SKIP_SECONDS = 10;
var SKIP_ANIMATION_MS = 400;

function onLoad() {
    songDuration = parseFloat(document.body.dataset.songDuration);
    document.getElementById("playButton").addEventListener("click", togglePlay);
    document.getElementById("goToStartButton").addEventListener("click", goToStart);
    document.getElementById("rewindButton").addEventListener("click", function () { skip(-SKIP_SECONDS); });
    document.getElementById("forwardButton").addEventListener("click", function () { skip(SKIP_SECONDS); });
    setUpMetronome();
}

function togglePlay() {
    if (isPlaying) {
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

function clampScroll(scrollY) {
    return Math.max(0, Math.min(scrollY, getMaxScroll()));
}

// The speed is chosen so that the whole page (including the last visible screen) passes
// in the time the song lasts. Scrolling stops at the bottom a fraction viewport/page earlier,
// leaving time to read the last screen. Starting from the middle of the page keeps the same pace.
function getScrollSpeed() {
    return document.documentElement.scrollHeight / songDuration;
}

function getBaseScrollY(now) {
    if (!isPlaying) {
        return baseScrollY;
    }
    return clampScroll(baseScrollY + scrollSpeed * (now - baseTime) / 1000);
}

function getSkipOffset(now) {
    if (!isSkipping) {
        return 0;
    }
    var progress = (now - skipStartTime) / SKIP_ANIMATION_MS;
    if (progress >= 1) {
        isSkipping = false;
        return 0;
    }
    // Ease out cubic: fast at the start, slow at the end.
    return skipOffset * Math.pow(1 - progress, 3);
}

function startAnimation() {
    if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(scrollStep);
    }
}

function scrollStep(now) {
    var currentBaseScrollY = getBaseScrollY(now);
    window.scrollTo(0, clampScroll(currentBaseScrollY + getSkipOffset(now)));
    if (isPlaying && !isSkipping && currentBaseScrollY >= getMaxScroll()) {
        isPlaying = false;
        updatePlayButton(false);
    }
    if (isPlaying || isSkipping) {
        animationFrameId = requestAnimationFrame(scrollStep);
    } else {
        animationFrameId = null;
    }
}

function play() {
    if (isPlaying) {
        return;
    }
    if (!isSkipping) {
        baseScrollY = window.scrollY;
    }
    scrollSpeed = getScrollSpeed();
    baseTime = performance.now();
    isPlaying = true;
    startAnimation();
    updatePlayButton(true);
}

function stop() {
    if (isPlaying) {
        baseScrollY = getBaseScrollY(performance.now());
        isPlaying = false;
    }
    updatePlayButton(false);
}

// Moves the page by the distance the auto scroll covers in the given seconds (negative goes back).
// While playing, the scroll keeps going from the new position.
function skip(seconds) {
    var now = performance.now();
    if (!isPlaying && !isSkipping) {
        // The user may have scrolled manually since the last animation.
        baseScrollY = window.scrollY;
    }
    var targetScrollY = clampScroll(getBaseScrollY(now) + getScrollSpeed() * seconds);
    baseScrollY = targetScrollY;
    baseTime = now;
    skipOffset = window.scrollY - targetScrollY;
    skipStartTime = now;
    isSkipping = true;
    startAnimation();
}

function goToStart() {
    stop();
    isSkipping = false;
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Metronome: plays a click on every beat at the BPM shown under the song title.
// The clicks are generated with the Web Audio API, so no sound file is needed.
// To keep the beat exact, the clicks are scheduled ahead on the audio clock instead of
// being played from a timer, which can fire late when the page is busy.
var METRONOME_LOOKAHEAD_MS = 25;
var METRONOME_SCHEDULE_AHEAD_SECONDS = 0.1;
var CLICK_FREQUENCY = 1000;
var CLICK_DURATION_SECONDS = 0.03;

var audioContext = null;
var metronomeBpm;
var metronomeTimerId = null;
var nextClickTime;

function setUpMetronome() {
    var bpmElement = document.querySelector(".songBpm");
    if (bpmElement === null) {
        return;
    }
    metronomeBpm = parseFloat(bpmElement.textContent.replace("BPM:", ""));
    // Songs whose BPM is still unknown show "BPM: X" and get no button.
    if (isNaN(metronomeBpm)) {
        return;
    }
    var button = document.createElement("button");
    button.className = "metronomeButton";
    button.id = "metronomeButton";
    button.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + PLAY_ICON_PATH + '"/></svg>';
    button.addEventListener("click", toggleMetronome);
    bpmElement.appendChild(button);
    updateMetronomeButton(false);
}

function toggleMetronome() {
    if (metronomeTimerId === null) {
        startMetronome();
    } else {
        stopMetronome();
    }
}

function updateMetronomeButton(isOn) {
    var button = document.getElementById("metronomeButton");
    button.title = isOn ? "Stop metronome" : "Play metronome";
    button.querySelector("path").setAttribute("d", isOn ? STOP_ICON_PATH : PLAY_ICON_PATH);
}

function startMetronome() {
    // Browsers only allow audio to start after a user action, so the context is created on the first click.
    if (audioContext === null) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    audioContext.resume();
    nextClickTime = audioContext.currentTime + 0.05;
    scheduleClicks();
    metronomeTimerId = setInterval(scheduleClicks, METRONOME_LOOKAHEAD_MS);
    updateMetronomeButton(true);
}

function stopMetronome() {
    clearInterval(metronomeTimerId);
    metronomeTimerId = null;
    updateMetronomeButton(false);
}

function scheduleClicks() {
    while (nextClickTime < audioContext.currentTime + METRONOME_SCHEDULE_AHEAD_SECONDS) {
        playClick(nextClickTime);
        nextClickTime += 60 / metronomeBpm;
    }
}

// A short beep that fades out quickly, so it sounds like a click.
function playClick(time) {
    var oscillator = audioContext.createOscillator();
    var gain = audioContext.createGain();
    oscillator.frequency.value = CLICK_FREQUENCY;
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + CLICK_DURATION_SECONDS);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(time);
    oscillator.stop(time + CLICK_DURATION_SECONDS);
}
