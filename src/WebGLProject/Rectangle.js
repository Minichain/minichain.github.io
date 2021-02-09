class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getVerticesAndIndices() {
        var vertices = [];
        var indices = [];
    
        vertices.push(this.x - this.width / 2);
        vertices.push(this.y - this.height / 2);
        vertices.push(0);
        indices.push(0);
        vertices.push(this.x + this.width / 2);
        vertices.push(this.y - this.height / 2);
        vertices.push(0);
        indices.push(1);
        vertices.push(this.x - this.width / 2);
        vertices.push(this.y + this.height / 2);
        vertices.push(0);
        indices.push(2);
        
        vertices.push(this.x + this.width / 2);
        vertices.push(this.y - this.height / 2);
        vertices.push(0);
        indices.push(3);
        vertices.push(this.x - this.width / 2);
        vertices.push(this.y + this.height / 2);
        vertices.push(0);
        indices.push(4);
        vertices.push(this.x + this.width / 2);
        vertices.push(this.y + this.height / 2);
        vertices.push(0);
        indices.push(5);

        return [vertices, indices];
    }
}