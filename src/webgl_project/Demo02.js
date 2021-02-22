class Demo02 {

    constructor() {
        this.canvas = document.querySelector("#canvas02");
        this.webGLManager = new WebGLManager(this.canvas);
        this.updateCanvas();
        this.init();
    }
    
    init() {
        this.oscillation = 0;
    }

    update(timeElapsed) {
        this.vertices = [];
        this.indices = [];
        this.oscillation += timeElapsed / 500;
        this.oscillation %= 2 * Math.PI;
        var x, y;
        for (var i = 0; i < 2000; i++) {
            x = i / 1000 - 1;
            y = (0.25 * Math.sin(this.oscillation + i / 5) + 0.7 * Math.sin(this.oscillation + i / 25) + Math.sin(this.oscillation + i / 50) - 0.5) * 0.25;
            this.vertices.push(x);
            this.vertices.push(y);
            this.vertices.push(0);
            this.indices.push(i);
        }
    }

    render() {
        this.webGLManager.clearCanvas(this.canvas);
        this.webGLManager.renderFigure([this.vertices, this.indices], "lines_strip");
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