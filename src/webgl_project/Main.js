var canvas;
var gl;

var fps = 60.0;
var lastTimeUpdate;

var massEntities = [];

function onLoad() {
    canvas = document.querySelector("#canvas");
    updateCanvas();
    initWebGL();
    initScene();
    lastTimeUpdate = new Date().getTime();
    renderLoop();
}

function onResize() {
    updateCanvas();
}

function updateCanvas() {
    canvas.width = canvas.parentElement.clientWidth * 0.9;    // 90% of parent width
    canvas.height = canvas.width * (9 / 16);
    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
}

function renderLoop() {
    var currentTime = new Date().getTime();
    var timeElapsed = currentTime - lastTimeUpdate;
    lastTimeUpdate = currentTime;

    update(timeElapsed);
    render();

	window.setTimeout(renderLoop, 1000.0 / fps);
}

function initScene() {
    massEntities = [];
    massEntities.push(new Mass(0, 0, 1000000, 1000, [0, 0]));
    massEntities.push(new Mass(0.1, 0, 100, 1, [0, 0.014]));
    massEntities.push(new Mass(0.2, 0, 100, 1, [0, 0.016]));
    massEntities.push(new Mass(0.3, 0, 100, 1, [0, 0.020]));
    massEntities.push(new Mass(0.4, 0, 100, 1, [0, 0.020]));
    massEntities.push(new Mass(0.5, 0, 100, 1, [0, 0.020]));
    massEntities.push(new Mass(0.6, 0, 100, 1, [0, 0.020]));
    massEntities.push(new Mass(0.7, 0, 100, 1, [0, 0.020]));
    massEntities.push(new Mass(0.8, 0, 100, 1, [0, 0.020]));
}

function update(timeElapsed) {
    for (var i = 0; i < massEntities.length; i++) {
        massEntities[i].update(timeElapsed);
    }
}

function render() {
    clearCanvas();
    for (var i = 0; i < massEntities.length; i++) {
        massEntities[i].render();
    }
}

function resetCanvas() {
    initScene();
}