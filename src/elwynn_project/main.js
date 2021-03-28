function onLoad() {
    updateProjectVideo();
}

function onResize() {
    updateProjectVideo();
}

function updateProjectVideo() {
    var projectVideoElement = document.getElementsByClassName("projectVideo")[0];
    projectVideoElement.width = projectVideoElement.parentElement.clientWidth * 0.9;    // 90% of parent width
    projectVideoElement.height = projectVideoElement.width * (9 / 16);
}