class Player {
    constructor(app, loader, spriteSheet) {
        this.x = 0;
        this.y = 0;
        this.spriteSheet = spriteSheet;
        loader.add(spriteSheet).load(setup);
        function setup() {
            let texture = PIXI.utils.TextureCache[spriteSheet];
            texture.frame = new PIXI.Rectangle(0, 0, 19, 21);
            let player = new PIXI.Sprite(texture);
            player.x = 0;
            player.y = 0;
            app.stage.addChild(player);
            app.renderer.render(app.stage);
            app.ticker.add(delta => gameLoop(delta));
        }
    }

    update(delta) {
        this.x += delta;
    }
}