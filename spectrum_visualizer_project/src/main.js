var fps = 60.0;
var lastUpdateTime;
var canvas;
var webGLManager;
var spectrum;

var audioContext;
var audioAnalyser;
var audioSource;
const FFT_SIZE = 256;
const SAMPLE_RATE = 44100;
var spectrumSamples = new Uint8Array(FFT_SIZE);

function onLoad() {
	canvas = document.querySelector("#canvas");
	function setFullscreen() {
        canvas.requestFullscreen();
    }
    canvas.addEventListener("click", setFullscreen);
    canvas.addEventListener('fullscreenchange', (event) => {
        updateCanvas(document.fullscreenElement);
    });

	webGLManager = new WebGLManager(this.canvas);
	spectrum = new Spectrum();
    lastUpdateTime = new Date().getTime();

	initAudio();
	updateCanvas();
    mainLoop();
}

function initAudio() {
	navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
		audioContext = new (window.AudioContext || window.webkitAudioContext)();
		audioAnalyser = audioContext.createAnalyser();
		audioAnalyser.soothingTimeConstant = 0.85;
		audioAnalyser.fftSize = FFT_SIZE;
		audioSource = audioContext.createMediaStreamSource(stream);
		audioSource.connect(audioAnalyser);
		console.log("Audio context: " + audioContext);
		console.log("Sample rate: " + audioContext.sampleRate);
		console.log("Audio analyzer: " + audioAnalyser);
		console.log("FFT size: " + audioAnalyser.fftSize);
		console.log("Audio source: " + audioSource);
		retrieveSamples();
	});
}

function retrieveSamples() {
	if (audioAnalyser != null) {
		audioAnalyser.getByteFrequencyData(spectrumSamples);
		for (let i = 0; i < FFT_SIZE; i++) {
			var newValue = spectrumSamples[i] / 200.0;
			if (spectrum.samples[i] <= newValue) {
				spectrum.samples[i] = newValue;
			}
		}
	}
	setTimeout(retrieveSamples, 0);
}

function onResize() {
    updateCanvas();
}

function mainLoop() {
    var currentTime = new Date().getTime();
    var timeElapsed = currentTime - lastUpdateTime;
    lastUpdateTime = currentTime;

    update(timeElapsed);
    render();

	window.setTimeout(mainLoop, 0);
}

function update(timeElapsed) {
	spectrum.update(timeElapsed);
}

function render() {
	webGLManager.clearCanvas(this.canvas);
	spectrum.render();
}

function updateCanvas(isFullscreen = false) {
    if (isFullscreen) {
        console.log("Canvas is Full Screen!!");
        canvas.width = screen.availWidth;
        canvas.height = screen.availHeight;
    } else {
        console.log("Canvas isn't Full Screen!!");
		canvas.width = canvas.parentElement.clientWidth;    // 90% of parent width
		canvas.height = canvas.width * (9 / 16);
    }
}