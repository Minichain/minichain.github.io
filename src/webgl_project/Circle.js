class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    getX() {
        return this.x;
    }

    setX(x) {
        this.x = x;
    }

    getY() {
        return this.x;
    }

    setY(y) {
        this.y = y;
    }

    getRadius() {
        return this.r;
    }

    getVerticesAndIndices() {
        var vertices = [];
        var indices = [];
    
        var iterations = 15;
        var step = (2 * Math.PI) / iterations;
        for (var i = 0; i < iterations; i++) {
            vertices.push(this.x);
            vertices.push(this.y);
            vertices.push(0);
            indices.push(i * 3);
    
            vertices.push(this.x + this.r * Math.cos(i * step));
            vertices.push(this.y + this.r * Math.sin(i * step));
            vertices.push(0);
            indices.push(i * 3 + 1);
    
            vertices.push(this.x + this.r * Math.cos((i * step) + step));
            vertices.push(this.y + this.r * Math.sin((i * step) + step));
            vertices.push(0);
            indices.push(i * 3 + 2);
        }

        return [vertices, indices]; 
    }
}