class WebGLManager {

    constructor(c) {
        this.vertex_buffer = null;
        this.index_Buffer = null;
        this.gl = c.getContext("webgl");
        if (!this.gl) {
            alert('Unable to initialize Webgl. Your browser or machine may not support it.');
            return;
        }

        this.loadTextures()
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

    loadTextures() {
        // setup GLSL program
        this.textureShader = webglUtils.createProgramFromScripts(this.gl, ["drawImage-vertex-shader", "drawImage-fragment-shader"]);

        // look up where the vertex data needs to go.
        this.texturePositionLocation = this.gl.getAttribLocation(this.textureShader, "a_position");
        this.texcoordLocation = this.gl.getAttribLocation(this.textureShader, "a_texcoord");

        // lookup uniforms
        this.matrixLocation = this.gl.getUniformLocation(this.textureShader, "u_matrix");
        this.textureLocation = this.gl.getUniformLocation(this.textureShader, "u_texture");

        // Create a buffer.
        this.texturePositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texturePositionBuffer);

        // Put a unit quad in the buffer
        var positions = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        // Create a buffer for texture coords
        this.texcoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);

        // Put texcoords in the buffer
        var texcoords = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texcoords), this.gl.STATIC_DRAW);
        var tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        // Fill the texture with a 1x1 blue pixel.
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
                        new Uint8Array([0, 0, 255, 255]));

        // let's assume all images are not a power of 2
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);

        this.textureInfo = {
            width: 1,   // we don't know the size until it loads
            height: 1,
            texture: tex
        };
        var img = new Image();
        img.src = 'spectrum_visualizer_project/res/images/logo_def_blanco_1200px.png';
        img.onload = () => {
            console.log("AdriLog: this.textureInfo: " + this.textureInfo)
            console.log("AdriLog: img.width: " + img.width)
            this.textureInfo.width = img.width;
            this.textureInfo.height = img.height;
    
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureInfo.texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
        }
    }

    // Unlike images, textures do not have a width and height associated
    // with them so we'll pass in the width and height of the texture
    drawImage(texWidth, texHeight, dstX, dstY) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureInfo.texture);

        // Tell WebGL to use our shader program pair
        this.gl.useProgram(this.textureShader);

        // Setup the attributes to pull data from our buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texturePositionBuffer);
        this.gl.enableVertexAttribArray(this.texturePositionLocation);
        this.gl.vertexAttribPointer(this.texturePositionLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer);
        this.gl.enableVertexAttribArray(this.texcoordLocation);
        this.gl.vertexAttribPointer(this.texcoordLocation, 2, this.gl.FLOAT, false, 0, 0);

        // this matrix will convert from pixels to clip space
        var matrix = m4.orthographic(0, this.gl.canvas.width, this.gl.canvas.height, 0, -1, 1);

        // this matrix will translate our quad to dstX, dstY
        matrix = m4.translate(matrix, dstX, dstY, 0);

        // this matrix will scale our 1 unit quad
        // from 1 unit to texWidth, texHeight units
        matrix = m4.scale(matrix, texWidth, texHeight, 1);

        // Set the matrix.
        this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

        // Tell the shader to get the texture from texture unit 0
        this.gl.uniform1i(this.textureLocation, 0);

        // draw the quad (2 triangles, 6 vertices)
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}