class LogoTexture {

    constructor(gl, url) {
        this.url = url;
        this.loadTexture(gl);
    }

    loadTexture(gl) {
        this.textureShader = webglUtils.createProgramFromScripts(gl, ["drawImage-vertex-shader", "drawImage-fragment-shader"]);

        // look up where the vertex data needs to go.
        this.texturePositionLocation = gl.getAttribLocation(this.textureShader, "a_position");
        this.texcoordLocation = gl.getAttribLocation(this.textureShader, "a_texcoord");

        // lookup uniforms
        this.matrixLocation = gl.getUniformLocation(this.textureShader, "u_matrix");
        this.textureLocation = gl.getUniformLocation(this.textureShader, "u_texture");

        // Create a buffer.
        this.texturePositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texturePositionBuffer);

        // Put a unit quad in the buffer
        var positions = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // Create a buffer for texture coords
        this.texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);

        // Put texcoords in the buffer
        var texcoords = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                        new Uint8Array([0, 0, 255, 255]));

        // let's assume all images are not a power of 2
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        this.textureInfo = {
            width: 1,   // we don't know the size until it loads
            height: 1,
            texture: tex
        };
        var img = new Image();
        img.src = this.url;
        img.onload = () => {
            console.log("AdriLog: this.textureInfo: " + this.textureInfo)
            console.log("AdriLog: img.width: " + img.width)
            this.textureInfo.width = img.width;
            this.textureInfo.height = img.height;
    
            gl.bindTexture(gl.TEXTURE_2D, this.textureInfo.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        }
    }

    // Unlike images, textures do not have a width and height associated
    // with them so we'll pass in the width and height of the texture
    drawTexture(gl, texWidth, texHeight, dstX, dstY) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        gl.bindTexture(gl.TEXTURE_2D, this.textureInfo.texture);

        // Tell WebGL to use our shader program pair
        gl.useProgram(this.textureShader);

        // Setup the attributes to pull data from our buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texturePositionBuffer);
        gl.enableVertexAttribArray(this.texturePositionLocation);
        gl.vertexAttribPointer(this.texturePositionLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
        gl.enableVertexAttribArray(this.texcoordLocation);
        gl.vertexAttribPointer(this.texcoordLocation, 2, gl.FLOAT, false, 0, 0);

        // this matrix will convert from pixels to clip space
        var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

        // this matrix will translate our quad to dstX, dstY
        matrix = m4.translate(matrix, dstX, dstY, 0);

        // this matrix will scale our 1 unit quad
        // from 1 unit to texWidth, texHeight units
        matrix = m4.scale(matrix, texWidth, texHeight, 1);

        // Set the matrix.
        gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

        // Tell the shader to get the texture from texture unit 0
        gl.uniform1i(this.textureLocation, 0);

        // draw the quad (2 triangles, 6 vertices)
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}