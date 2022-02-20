class Spectrum {
    
    constructor() {
        this.samples = new Float32Array(FFT_SIZE);
    }

    update(timeElapsed) {
        for (let i = 0; i < FFT_SIZE; i++) {
            this.samples[i] = this.samples[i] - 0.01;
        }
    }

    render() {
        var vertices = [];
        var indices = [];
        var averageGain = 0;
        for (let i = 0; i < FFT_SIZE; i++) {
            var width = 0.02;
            var x = - 1 + i * width;
            var height = this.samples[i];

            var bottomLeftCorner = [x, -1];
            var topLeftCorner = [x, height - 1];
            var topRightCorner = [x + width, height - 1];
            var bottomRightCorner = [x + width, -1];
 
            vertices.push(bottomLeftCorner[0]);
            vertices.push(bottomLeftCorner[1]);
            vertices.push(0);
            indices.push(i * 6 + 0);

            vertices.push(topLeftCorner[0]);
            vertices.push(topLeftCorner[1]);
            vertices.push(0);
            indices.push(i * 6 + 1);
            
            vertices.push(bottomRightCorner[0]);
            vertices.push(bottomRightCorner[1]);
            vertices.push(0);
            indices.push(i * 6 + 2);

            vertices.push(topLeftCorner[0]);
            vertices.push(topLeftCorner[1]);
            vertices.push(0);
            indices.push(i * 6 + 3);

            vertices.push(topRightCorner[0]);
            vertices.push(topRightCorner[1]);
            vertices.push(0);
            indices.push(i * 6 + 4);

            vertices.push(bottomRightCorner[0]);
            vertices.push(bottomRightCorner[1]);
            vertices.push(0);
            indices.push(i * 6 + 5);

            averageGain += this.samples[i];
        }
        webGLManager.drawTextures(averageGain / FFT_SIZE);
        webGLManager.renderFigure([vertices, indices], "triangles");
    }
}