const canvas = document.getElementById("canvas");

const engine = new BABYLON.Engine(canvas, true);

var camera;

function initScene() {
    console.log("Creating Scene!");

    const scene = new BABYLON.Scene(engine);
    scene.gravity = new BABYLON.Vector3(0, -0.25, 0); 
    scene.collisionsEnabled = true;
    scene.enablePhysics();

    camera = new Camera(canvas, scene);

    InputListener.initInputListener(canvas);

    var isLocked = false;
    
    scene.onPointerDown = function (evt) {
        if (!isLocked) {
            canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }
    };

	var pointerLockChange = function () {
		var controlEnabled = document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || document.pointerLockElement || null;
		isLocked = controlEnabled;
	};

	document.addEventListener("pointerlockchange", pointerLockChange, false);
	document.addEventListener("mspointerlockchange", pointerLockChange, false);
	document.addEventListener("mozpointerlockchange", pointerLockChange, false);
	document.addEventListener("webkitpointerlockchange", pointerLockChange, false);

    /* Light */

    var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-1, -3, 1), scene);
    light.position = new BABYLON.Vector3(30, 90, 30);
    light.intensity = 1;

    /* Ground */

    var ground = BABYLON.Mesh.CreateGround("ground", 256, 256, 1, scene);
    ground.receiveShadows = true;
    var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
    backgroundMaterial.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/backgroundGround.png", scene);
    backgroundMaterial.diffuseTexture.hasAlpha = true;
    backgroundMaterial.shadowLevel = 0.75;
    ground.material = backgroundMaterial;
    ground.checkCollisions = true;

    /* Figures */

    const N = 24;
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.enableSoftTransparentShadow = false;
    shadowGenerator.transparencyShadow = true;

    function addFigure(figureType, iteration, color, position, left = false) {
        var figure;
        var figureName = figureType + iteration;

        switch (figureType) {
            case "cylinder":
                figure = BABYLON.MeshBuilder.CreateCylinder(figureName, {}, scene);
                break;
            case "sphere":
                figure = BABYLON.MeshBuilder.CreateSphere(figureName, {}, scene);
                break;
            case "box":
            default:
                figure = BABYLON.MeshBuilder.CreateBox(figureName, {
                    size: 1
                }, scene);
                break;
        }
        
        figure.position = position;
        var material = new BABYLON.StandardMaterial("material", scene);
        material.diffuseColor = color;
        figure.material = material;
        shadowGenerator.addShadowCaster(figure);

        scene.onBeforeRenderObservable.add(() => {
            figure.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 100, BABYLON.Space.LOCAL);
            if (left) {
                figure.position.x -= 0.05;
            } else {
                figure.position.x += 0.05;
            }
            if (figure.position.x > ((N / 2) * 5)) {
                figure.position.x = - ((N / 2) * 5);
            } else if (figure.position.x < - ((N / 2) * 5)) {
                figure.position.x = ((N / 2) * 5);
            }
            alpha = 1 - computeDistance(figure.position, new BABYLON.Vector3(0, 5, 0)) / (12 * 5);
            if (alpha < 0) alpha = 0;
            figure.material.alpha = alpha;    
        });
    }    

    for (var i = 0; i < N; i++) {
        /* Cylinders */
        addFigure("cylinder", i, new BABYLON.Color3(Math.random(), Math.random(), Math.random()), new BABYLON.Vector3(i * 5 - (N / 2) * 5, 7.5, 0))

        /* Spheres */
        addFigure("sphere", i, new BABYLON.Color3(Math.random(), Math.random(), Math.random()), new BABYLON.Vector3(i * 5 - (N / 2) * 5, 5, 0), true)  

        /* Boxes */
        addFigure("box", i, new BABYLON.Color3(Math.random(), Math.random(), Math.random()), new BABYLON.Vector3(i * 5 - (N / 2) * 5, 2.5, 0))  
    }

    /* Lines */
    var points = [];
    var points01 = [];
    var points02 = [];
    var points03 = [];

    for (var i = 0; i < 1000; i++) {
        points01.push(new BABYLON.Vector3((i) - 500, Math.sin(i / 10) + 5, 50));
        points02.push(new BABYLON.Vector3((i) - 500, Math.sin(i / 5) + 7.5, 25));
        points03.push(new BABYLON.Vector3((i) - 500, Math.sin(i / 2.5) + 2.5, 75));
    }

    points = points01;
    const lines01 = BABYLON.MeshBuilder.CreateLines("sinusoidal01", {
        points
    }, scene);

    points = points02;
    const lines02 = BABYLON.MeshBuilder.CreateLines("sinusoidal02", {
        points
    }, scene);

    points = points03;
    const lines03 = BABYLON.MeshBuilder.CreateLines("sinusoidal03", {
        points
    }, scene);

    function createCylinderTable(name, height, diameter, position, color) {
        var table = BABYLON.MeshBuilder.CreateCylinder(name, {
            height: height,
            diameter: diameter
        }, scene);
        table.position = position;
        var material = new BABYLON.StandardMaterial("material", scene);
        material.diffuseColor = color;
        table.material = material;    
        shadowGenerator.addShadowCaster(table);
        table.receiveShadows = true;
        table.checkCollisions = true;
    }

    createCylinderTable("table1", 4, 4, new BABYLON.Vector3(-25, 2, -25), new BABYLON.Color3(0.75, 0, 0));
    createCylinderTable("table2", 4, 4, new BABYLON.Vector3(0, 2, -25), new BABYLON.Color3(0, 0.75, 0));
    createCylinderTable("table3", 4, 4, new BABYLON.Vector3(25, 2, -25), new BABYLON.Color3(0, 0, 0.75));

    function addGuitar(position, color) {
        BABYLON.SceneLoader.ImportMesh("", "res/meshes/", "guitar.stl", scene, function(meshes) {
            meshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
            meshes[0].position = position;
            meshes[0].rotate(new BABYLON.Vector3(0, 0, 1), Math.PI / 2, BABYLON.Space.LOCAL);
            meshes[0].rotate(new BABYLON.Vector3(1, 0, 0), -Math.PI / 2, BABYLON.Space.LOCAL);
            var material = new BABYLON.StandardMaterial("material", scene);
            material.diffuseColor = color;
            meshes[0].material = material;    
            shadowGenerator.addShadowCaster(meshes[0]);
            var t = 0;
            var height = position.y;
            scene.onBeforeRenderObservable.add(() => {
                t += 0.025 % (2 * Math.PI);
                meshes[0].position.y = height + Math.sin(t) * 0.5;
            });
        });
    }

    addGuitar(new BABYLON.Vector3(-26.25, 6.2, -25), new BABYLON.Color3(0.75, 0, 0));
    addGuitar(new BABYLON.Vector3(-1.25, 6.2, -25), new BABYLON.Color3(0, 0.75, 0));
    addGuitar(new BABYLON.Vector3(23.75, 6.2, -25), new BABYLON.Color3(0, 0, 0.75));

    /* Music */
    const music1 = new BABYLON.Sound("background_music", "res/audio/track02.wav", scene, soundReady, {
        loop: true,
        spatialSound: true,
        distanceModel: "exponential",
        rolloffFactor: 0.75
    });
    music1.setPosition(new BABYLON.Vector3(-25, 2, -25));

    const music2 = new BABYLON.Sound("background_music", "res/audio/track01.wav", scene, soundReady, {
        loop: true,
        spatialSound: true,
        distanceModel: "exponential",
        rolloffFactor: 0.75
    });
    music2.setPosition(new BABYLON.Vector3(0, 2, -25));

    const music3 = new BABYLON.Sound("background_music", "res/audio/track03.wav", scene, soundReady, {
        loop: true,
        spatialSound: true,
        distanceModel: "exponential",
        rolloffFactor: 0.75
    });
    music3.setPosition(new BABYLON.Vector3(25, 2, -25));

    var soundsReady = 0;
    function soundReady() {
        soundsReady++;
        if (soundsReady === 3) {
            music1.play();
            music2.play();
            music3.play();
        }
    }

    // scene.debugLayer.show();

    return scene;
}

const scene = initScene();

function update() {
    camera.updateCamera();
}

engine.runRenderLoop(() => {
    update();
    scene.render();
});

function onLoad() {
    function setFullscreen() {
        canvas.requestFullscreen();
    }
    canvas.addEventListener("click", setFullscreen);
    canvas.addEventListener('fullscreenchange', (event) => {
        updateCanvas(document.fullscreenElement);
    });

    updateCanvas();
}

function onResize() {
    updateCanvas();
}

function updateCanvas(isFullscreen = false) {
    if (isFullscreen) {
        console.log("Canvas is Full Screen!!");
        canvas.width = screen.availWidth;
        canvas.height = screen.availHeight;
    } else {
        console.log("Canvas isn't Full Screen!!");
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.width * (9 / 16); 
    }
}