class Demo01 {

    constructor() {
        this.canvas = document.querySelector("#canvas01");
        this.webGLManager = new WebGLManager(this.canvas);
        this.updateCanvas();
        this.init();
    }

    init() {
        this.massEntities = [];
        this.massEntities.push(new Mass(0, 0, 1000000, 1000, [0, 0], this.canvas.width, this.canvas.height));   // Center mass
        var sign = 1;
        for (var i = 0; i < 4; i++) {
            sign *= -1;
            this.massEntities.push(new Mass((0.15 + i * 0.15) * sign, 0, 100, 1, [0, (0.016 + i * 0.002) * sign], this.canvas.width, this.canvas.height));
        }
    }
    
    update(timeElapsed) {
        for (var i = 0; i < this.massEntities.length; i++) {
            this.massEntities[i].update(timeElapsed, this.massEntities);
        }
    }
    
    render() {
        this.webGLManager.clearCanvas(this.canvas);
        for (var i = 0; i < this.massEntities.length; i++) {
            this.massEntities[i].render(this.webGLManager);
        }
    }
    
    reset() {
        this.init();
    }

    updateCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth * 0.9;    // 90% of parent width
        this.canvas.height = this.canvas.width * (9 / 16);
        this.canvas.style.width = this.canvas.width;
        this.canvas.style.height = this.canvas.height;
    }    
}
