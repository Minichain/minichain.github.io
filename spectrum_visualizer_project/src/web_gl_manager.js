class WebGLManager {

    constructor(c) {
        this.vertex_buffer = null;
        this.index_Buffer = null;
        this.gl = c.getContext("webgl");
        if (!this.gl) {
            alert('Unable to initialize Webgl. Your browser or machine may not support it.');
            return;
        }
        this.logo = new LogoTexture(this.gl, 'spectrum_visualizer_project/res/images/logo_def_blanco_1200px.png')
    }
    
    clearCanvas(c) {
        // Clear the canvas
        this.gl.clearColor(0.1, 0.1, 0.1, 0.01);
        // Clear the color buffer bit
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // Set the view port
        this.gl.viewport(0, 0, c.width, c.height);
    }
    
    loadShader01(vertex_buffer, index_Buffer) {
        var vertCode =
            'attribute vec3 coordinates;' +
            'void main(void) {' +
            '   gl_Position = vec4(coordinates, 1.0);' +
            '}';
    
        var vertShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    
        this.gl.shaderSource(vertShader, vertCode);
        this.gl.compileShader(vertShader);
    
        var fragCode =
            'void main(void) {' +
            '   gl_FragColor = vec4(1.0, 0.9, 0.2, 1.0);' +
            '}';
    
        var fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    
        this.gl.shaderSource(fragShader, fragCode); 
        this.gl.compileShader(fragShader);
    
        var shaderProgram = this.gl.createProgram();
        
        this.gl.attachShader(shaderProgram, vertShader);
        this.gl.attachShader(shaderProgram, fragShader);
        this.gl.linkProgram(shaderProgram);
        this.gl.useProgram(shaderProgram);
    
        /*======= Associating shaders to buffer objects =======*/
    
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertex_buffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, index_Buffer);
    
        var coord = this.gl.getAttribLocation(shaderProgram, "coordinates");
        // Point an attribute to the currently bound VBO
        this.gl.vertexAttribPointer(coord, 3, this.gl.FLOAT, false, 0, 0); 
        // Enable the attribute
        this.gl.enableVertexAttribArray(coord);
    }
    
    renderFigure(values, drawMode) {
        var vertices = values[0];
        var indices = values[1];
    
        if (this.vertex_buffer =! null) this.vertex_buffer = this.gl.createBuffer();
        // Bind appropriate array buffer to it
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertex_buffer);
        // Pass the vertex data to the buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        // Unbind the buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    
        if (this.index_Buffer =! null) this.index_Buffer = this.gl.createBuffer();
        // Bind appropriate array buffer to it
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.index_Buffer);
        // Pass the vertex data to the buffer
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
        // Unbind the buffer
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    
        this.loadShader01(this.vertex_buffer, this.index_Buffer);
    
        if (drawMode === "lines") {
            this.gl.drawElements(this.gl.LINES, indices.length, this.gl.UNSIGNED_SHORT, 0);
        } else if (drawMode === "lines_strip") {
            this.gl.drawElements(this.gl.LINE_STRIP, indices.length, this.gl.UNSIGNED_SHORT, 0);
        } else {
            this.gl.drawElements(this.gl.TRIANGLES, indices.length, this.gl.UNSIGNED_SHORT, 0);
        }
    }

    drawTextures(gain) {
        this.logo.drawTexture(this.gl, 700 + gain, 150 + gain, 25, 100)
    }
}