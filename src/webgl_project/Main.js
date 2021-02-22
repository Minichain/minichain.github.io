var demo01;
var demo02;

var fps = 60.0;
var lastTimeUpdate;

function onLoad() {
    demo01 = new Demo01();
    demo02 = new Demo02();
    demo01.updateCanvas();
    demo02.updateCanvas();
    lastTimeUpdate = new Date().getTime();
    renderLoop();
}

function onResize() {
    demo01.updateCanvas();
    demo02.updateCanvas();
}

function renderLoop() {
    var currentTime = new Date().getTime();
    var timeElapsed = currentTime - lastTimeUpdate;
    lastTimeUpdate = currentTime;

    demo01.update(timeElapsed);
    demo02.update(timeElapsed);
    demo01.render();
    demo02.render();

	window.setTimeout(renderLoop, 1000.0 / fps);
}