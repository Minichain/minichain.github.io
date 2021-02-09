var canvas;
var gl;

var fps = 60.0;
var lastTimeUpdate;

var circle01;
var rectangle01;
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
    circle01 = new Circle(0, 0, 0.1);
    rectangle01 = new Rectangle(0, 0, 0.2, 0.2);
}

function update(timeElapsed) {
    oscillation = (oscillation + timeElapsed * 0.005) % (2 * Math.PI);

    circle01.setX(Math.cos(oscillation) * 0.5);
    rectangle01.setY(Math.sin(oscillation) * 0.5);
}

function render() {
    clearCanvas();

    renderFigure(circle01);
    renderFigure(rectangle01);
}

function renderFigure(figure) {
    var values = figure.getVerticesAndIndices();
    var vertices = values[0];
    var indices = values[1];

    var vertex_buffer = gl.createBuffer();
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var index_Buffer = gl.createBuffer();
    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);
    // Pass the vertex data to the buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    // Unbind the buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    loadShader(vertex_buffer, index_Buffer);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
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