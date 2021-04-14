var canvas;
var app;
var player;
var loader;

function initScene() {
    canvas = document.getElementById("canvas");
    function setFullscreen() {
        canvas.requestFullscreen();
    }
    canvas.addEventListener("click", setFullscreen);
    canvas.addEventListener('fullscreenchange', (event) => {
        updateCanvas(document.fullscreenElement);
    });

    app = new PIXI.Application({
        width: 640,
        height: 360,
        backgroundColor: 0xD0D3D4, 
        view: canvas
    });
    app.renderer.autoResize = true;

    document.body.appendChild(app.view);

    loader = new PIXI.Loader();

    spriteSheet = "res/images/pixi_project/player.png";
    loader.add(spriteSheet).load(setup);
    function setup() {
        let texture = PIXI.utils.TextureCache[spriteSheet];
        texture.frame = new PIXI.Rectangle(0, 0, 19, 21);
        player = new PIXI.Sprite(texture);
        player.x = 0;
        player.y = 0;
        app.stage.addChild(player);
        app.renderer.render(app.stage);
        app.ticker.add(delta => gameLoop(delta));
    }

    // player = new Player(app, loader, "res/images/pixi_project/player.png");
}

function gameLoop(delta) {
    console.log("Game Loop. Delta: " + delta);
    // player.update(delta);
    player.x += delta;
    player.y += delta;
}

function onLoad() {
    initScene();
    updateCanvas();
}

function onResize() {
    updateCanvas();
}

function updateCanvas(isFullscreen = false) {
    if (isFullscreen) {
        canvas.width = screen.availWidth;
        canvas.height = screen.availHeight;
    } else {
        canvas.width = canvas.parentElement.clientWidth * 0.5;
        canvas.height = canvas.width * (9 / 16); 
    }
}