function websiteVisits(response) {
    console.log("Total website visits: " + response.value);
}

var PORTRAIT_IMAGE_SRC = "index/res/images/minichain_profile_picture.png";

// The portrait is a looping video, with the same picture as a PNG for when something goes wrong:
// - If the video fails to load or play, it is replaced by the PNG.
// - If the browser blocks autoplay (iOS Low Power Mode, battery/data saver...), the PNG is shown as the
//   poster and the video is started on the first tap or click anywhere on the page.
function setUpPortraitVideo() {
    var video = document.getElementById("portraitVideo");
    // Errors loading a <source> are fired on the <source> element, not on the <video>.
    video.querySelector("source").addEventListener("error", function () { replaceWithImage(video); });
    video.addEventListener("error", function () { replaceWithImage(video); });
    // The video may have already failed before this runs.
    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        replaceWithImage(video);
        return;
    }

    var playPromise = video.play();
    if (playPromise === undefined) {
        return;
    }
    playPromise.catch(function (error) {
        if (error.name !== "NotAllowedError") {
            replaceWithImage(video);
            return;
        }
        var events = ["pointerdown", "touchstart", "keydown"];
        function playOnInteraction() {
            events.forEach(function (name) { document.removeEventListener(name, playOnInteraction); });
            video.play().catch(function () { replaceWithImage(video); });
        }
        events.forEach(function (name) { document.addEventListener(name, playOnInteraction); });
    });
}

function replaceWithImage(video) {
    if (!video.parentNode) {
        return;
    }
    var image = document.createElement("img");
    image.className = video.className;
    image.src = PORTRAIT_IMAGE_SRC;
    video.parentNode.replaceChild(image, video);
}

document.addEventListener("DOMContentLoaded", setUpPortraitVideo);
