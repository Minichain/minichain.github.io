var vertex_buffer;
var index_Buffer;

function initWebGL() {
    gl = canvas.getContext("webgl");
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }
}

function clearCanvas() {
    // Clear the canvas
    gl.clearColor(0.1, 0.1, 0.1, 0.01);
    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Set the view port
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function loadShader(vertex_buffer, index_Buffer) {
    var vertCode =
        'attribute vec3 coordinates;' +
            
        'void main(void) {' +
        '   gl_Position = vec4(coordinates, 1.0);' +
        '}';

    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    var fragCode =
        'void main(void) {' +
        '   gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);' +
        '}';

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(fragShader, fragCode); 
    gl.compileShader(fragShader);

    var shaderProgram = gl.createProgram();
    
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    /*======= Associating shaders to buffer objects =======*/

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);

    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); 
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
}

function renderFigure(values) {
    var vertices = values[0];
    var indices = values[1];

    if (vertex_buffer =! null) vertex_buffer = gl.createBuffer();
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    if (index_Buffer =! null) index_Buffer = gl.createBuffer();
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    loadShader(vertex_buffer, index_Buffer);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}