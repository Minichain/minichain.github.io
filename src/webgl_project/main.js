var demo01;
var demo02;

var fps = 60.0;
var lastUpdateTime;

function onLoad() {
    demo01 = new Demo01();
    demo02 = new Demo02();
    demo01.updateCanvas();
    demo02.updateCanvas();
    lastUpdateTime = new Date().getTime();
    mainLoop();
}

function onResize() {
    demo01.updateCanvas();
    demo02.updateCanvas();
}

function mainLoop() {
    var currentTime = new Date().getTime();
    var timeElapsed = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;

    demo01.update(timeElapsed);
    demo02.update(timeElapsed);
    demo01.render();
    demo02.render();

	window.setTimeout(mainLoop, 0);
}