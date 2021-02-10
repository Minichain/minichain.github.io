class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toWebGLCoordinates(canvas) {
        var halfWidth = canvas.width / 2;
        var halfHeight = canvas.height / 2;
        this.x = (this.x - halfWidth) / halfWidth;
        this.y = (this.y - halfHeight) / halfHeight;
    }

    toCanvasCoordinates() {
        var halfWidth = canvas.width / 2;
        var halfHeight = canvas.height / 2;
        this.x = (this.x * halfWidth) + halfWidth;
        this.y = (this.y * halfHeight) + halfHeight;
    }
}