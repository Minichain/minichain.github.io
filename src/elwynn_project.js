function onLoad() {
    updateProjectVideo();
}

function onResize() {
    updateProjectVideo();
}

function updateProjectVideo() {
    $(".projectVideo").width("90%");
    $(".projectVideo").height($(".projectVideo").width() * (9 / 16));
}