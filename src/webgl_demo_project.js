var canvas;
var gl;

var fps = 60.0;
var lastTimeUpdate;

var circle = {x: 0, y: 0, r: 0.1};
var oscillation;

function onLoad() {
    initWebGL();
    updateCanvas();
}

function onResize() {
    updateCanvas();
}

function updateCanvas() {
    canvas.width = canvas.parentElement.clientWidth * 0.9;    // 90% of parent width
    canvas.height = canvas.width * (9 / 16);
    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
}

function initWebGL() {
    canvas = document.querySelector("#canvas");
    gl = canvas.getContext("webgl");

    // If we don't have a GL context, give up now

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    initScene();

    lastTimeUpdate = new Date().getTime();
    renderLoop();
}

function renderLoop() {
    var currentTime = new Date().getTime();
    var timeElapsed = currentTime - lastTimeUpdate;
    lastTimeUpdate = currentTime;

    update(timeElapsed);
    render();

	window.setTimeout(renderLoop, 1000.0 / fps);
}

function initScene() {
    oscillation = 0;
}

function update(timeElapsed) {
    oscillation = (oscillation + timeElapsed * 0.005) % (2 * Math.PI);

    circle.x = Math.cos(oscillation) * 0.5;
    circle.y = Math.sin(oscillation) * 0.5;
}

function render() {
    var values = computeVerticesAndIndices();
    var vertices = values[0];
    var indices = values[1];

    // console.log("vertices length: " + vertices.length);
    // console.log("indices length: " + indices.length);

    // Create an empty buffer object to store vertex buffer
    var vertex_buffer = gl.createBuffer();
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    // Create an empty buffer object to store Index buffer

    var index_Buffer = gl.createBuffer();
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    loadShader(vertex_buffer, index_Buffer);

    // Clear the canvas
    gl.clearColor(0.1, 0.1, 0.1, 0.01);
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);
    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Set the view port
    gl.viewport(0, 0, canvas.width, canvas.height);
    // Draw the triangle
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}

function computeVerticesAndIndices() {
    var vertices = [];
    var indices = [];

    var iterations = 15;
    var step = (2 * Math.PI) / iterations;
    for (var i = 0; i < iterations; i++) {
        vertices.push(circle.x);
        vertices.push(circle.y);
        vertices.push(0);
        indices.push(i * 3);

        vertices.push(circle.x + circle.r * Math.cos(i * step));
        vertices.push(circle.y + circle.r * Math.sin(i * step));
        vertices.push(0);
        indices.push(i * 3 + 1);

        vertices.push(circle.x + circle.r * Math.cos((i * step) + step));
        vertices.push(circle.y + circle.r * Math.sin((i * step) + step));
        vertices.push(0);
        indices.push(i * 3 + 2);
    }

    return [vertices, indices]; 
}

function loadShader(vertex_buffer, index_Buffer) {

    // Vertex shader source code
    var vertCode =
        'attribute vec3 coordinates;' +
            
        'void main(void) {' +
        '   gl_Position = vec4(coordinates, 1.0);' +
        '}';

    // Create a vertex shader object
    var vertShader = gl.createShader(gl.VERTEX_SHADER);

    // Attach vertex shader source code
    gl.shaderSource(vertShader, vertCode);
    // Compile the vertex shader
    gl.compileShader(vertShader);

    //fragment shader source code
    var fragCode =
        'void main(void) {' +
        '   gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);' +
        '}';

    // Create fragment shader object
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    // Attach fragment shader source code
    gl.shaderSource(fragShader, fragCode); 
    // Compile the fragmentt shader
    gl.compileShader(fragShader);

    // Create a shader program object to store
    // the combined shader program
    var shaderProgram = gl.createProgram();
    
    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);
    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);
    // Link both the programs
    gl.linkProgram(shaderProgram);
    // Use the combined shader program object
    gl.useProgram(shaderProgram);

    /*======= Associating shaders to buffer objects =======*/

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Bind index buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index_Buffer);

    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); 
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
}