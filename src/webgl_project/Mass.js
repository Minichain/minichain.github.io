class Mass {
    constructor(x, y, m, d, v0) {
        var halfWidth = canvas.width / 2;
        var halfHeight = canvas.height / 2;
        this.coordinates = new Coordinates(x, y);
        this.mass = m;
        this.volume = m / d;
        this.r1 = Math.pow((3.0 * this.volume) / (4.0 * Math.PI), 1.0/ 3.0) / halfWidth;
        this.r2 = Math.pow((3.0 * this.volume) / (4.0 * Math.PI), 1.0/ 3.0) / halfHeight;
        this.velocity = v0;
    }

    setCoordinates(x, y) {
        this.coordinates.x = x;
        this.coordinates.y = y;
    }

    getRadius1() {
        return this.r1;
    }

    getRadius2() {
        return this.r2;
    }

    update(timeElapsed) {
        var G = 0.000000000667408;

        if (massEntities.length > 1) {
            var totalForce = [0, 0];
            var forceIterator = 0;
            for (var i = 0; i < massEntities.length; i++) {
                var currentMass = massEntities[i];
                if (currentMass != this) {
                    var vector = [currentMass.coordinates.x - this.coordinates.x, currentMass.coordinates.y - this.coordinates.y];
                    var force = G * (this.mass * currentMass.mass) / module(vector);
                    var normalizedVector = normalizeVector(vector);
                    var forceXAxis = force * normalizedVector[0];
                    var forceYAxis = force * normalizedVector[1];
                    totalForce[0] += forceXAxis;
                    totalForce[1] += forceYAxis;
                    forceIterator++;
                }
            }
            var acceleration = [totalForce[0] / this.mass, totalForce[1] / this.mass];
            this.velocity[0] += acceleration[0];
            this.velocity[1] += acceleration[1];

            this.coordinates.x += this.velocity[0] * timeElapsed * 0.1;
            this.coordinates.y += this.velocity[1] * timeElapsed * 0.1;
        }
    }

    render() {
        renderFigure(this.getVerticesAndIndices());
    }

    getVerticesAndIndices() {
        var vertices = [];
        var indices = [];
        
        var iterations = 15;
        var step = (2 * Math.PI) / iterations;
        for (var i = 0; i < iterations; i++) {
            vertices.push(this.coordinates.x);
            vertices.push(this.coordinates.y);
            vertices.push(0);
            indices.push(i * 3);
    
            vertices.push(this.coordinates.x + this.r1 * Math.cos(i * step));
            vertices.push(this.coordinates.y + this.r2 * Math.sin(i * step));
            vertices.push(0);
            indices.push(i * 3 + 1);
    
            vertices.push(this.coordinates.x + this.r1 * Math.cos((i * step) + step));
            vertices.push(this.coordinates.y + this.r2 * Math.sin((i * step) + step));
            vertices.push(0);
            indices.push(i * 3 + 2);
        }

        return [vertices, indices]; 
    }
}