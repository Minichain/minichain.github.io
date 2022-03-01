class WebGLManager {

    constructor(c) {
        this.vertex_buffer = null;
        this.index_Buffer = null;
        this.gl = c.getContext("webgl");
        if (!this.gl) {
            alert('Unable to initialize Webgl. Your browser or machine may not support it.');
            return;
        }
        this.logo = new Texture(this.gl, 'spectrum_visualizer_project/res/images/logo_def_blanco_1200px.png')
        this.background = new Texture(this.gl, 'spectrum_visualizer_project/res/images/background_02.jpg')
    }
    
    clearCanvas(c) {
        // Clear the canvas
        this.gl.clearColor(0, 0, 0, 1);
        // Clear the color buffer bit
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        // Set the view port
        this.gl.viewport(0, 0, c.width, c.height);

        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }
    
    loadShader01(vertex_buffer, index_Buffer) {
        var shaderProgram = webglUtils.createProgramFromScripts(this.gl, ["drawImage-vertex-shader01", "drawImage-fragment-shader01"]);
    
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

    renderBackground(gain) {
        gain *= 75;
        var width = (canvas.width + gain);
        var height = (canvas.height + gain);
        this.background.drawTexture(
            this.gl,
            width,
            height,
            (canvas.width - canvas.width / 2) - width / 2,
            (canvas.height - canvas.height / 2) - height / 2
        )
    }

    renderLogo(gain) {
        gain *= 500;
        var width = (canvas.width + gain) * 0.7;
        var height = (canvas.height + gain) * 0.3;
        this.logo.drawTexture(
            this.gl,
            width,
            height,
            (canvas.width - canvas.width / 2) - width / 2,
            (canvas.height - canvas.height / 2) - height / 2
        )
    }
}