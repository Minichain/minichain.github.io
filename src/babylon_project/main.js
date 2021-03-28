const N = 24;

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

    var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-1, -3, 1), scene);
    light.position = new BABYLON.Vector3(3, 9, 3);
    light.intensity = 0.75;

    var ground = BABYLON.Mesh.CreateGround("ground", 128, 128, 1, scene);
    ground.receiveShadows = true;
    var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
    backgroundMaterial.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/backgroundGround.png", scene);
    backgroundMaterial.diffuseTexture.hasAlpha = true;
    backgroundMaterial.shadowLevel = 0.75;
    ground.material = backgroundMaterial;

    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

    function addFigure(figureType, iteration, color, position) {
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
    }    

    for (var i = 0; i < N; i++) {
        /* Cylinders */
        addFigure("cylinder", i, new BABYLON.Color3(Math.random(), Math.random(), Math.random()), new BABYLON.Vector3(i * 5 - (N / 2) * 5, 7.5, 0))

        /* Spheres */
        addFigure("sphere", i, new BABYLON.Color3(Math.random(), Math.random(), Math.random()), new BABYLON.Vector3(i * 5 - (N / 2) * 5, 5, 0))  

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
        var table1 = BABYLON.MeshBuilder.CreateCylinder(name, {
            height: height,
            diameter: diameter
        }, scene);
        table1.position = position;
        var material = new BABYLON.StandardMaterial("material", scene);
        material.diffuseColor = color;
        table1.material = material;    
    }

    createCylinderTable("table1", 4, 4, new BABYLON.Vector3(-25, 2, -25), new BABYLON.Color3(0.75, 0, 0));
    createCylinderTable("table2", 4, 4, new BABYLON.Vector3(0, 2, -25), new BABYLON.Color3(0, 0.75, 0));
    createCylinderTable("table3", 4, 4, new BABYLON.Vector3(25, 2, -25), new BABYLON.Color3(0, 0, 0.75));

    const music1 = new BABYLON.Sound("background_music", "res/audio/track2.wav", scene, soundReady, {
        loop: true,
        spatialSound: true,
        distanceModel: "exponential",
        rolloffFactor: 0.75
    });
    music1.setPosition(new BABYLON.Vector3(-25, 2, -25));
    const music2 = new BABYLON.Sound("background_music", "res/audio/track1.wav", scene, soundReady, {
        loop: true,
        spatialSound: true,
        distanceModel: "exponential",
        rolloffFactor: 0.75
    });
    music2.setPosition(new BABYLON.Vector3(0, 2, -25));
    const music3 = new BABYLON.Sound("background_music", "res/audio/track3.wav", scene, soundReady, {
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

    // BABYLON.SceneLoader.Append("res/meshes/", "guitar.stl", scene, null);
    var guitarMesh;
    BABYLON.SceneLoader.ImportMesh("", "res/meshes/", "guitar.stl", scene, function(meshes) {
        guitarMesh = meshes[0];
        guitarMesh.scaling=new BABYLON.Vector3(0.1,0.1,0.1);
        guitarMesh.position = new BABYLON.Vector3(-25, 4.1, -23.75);
        guitarMesh.checkCollisions = true;
    });
    BABYLON.SceneLoader.ImportMesh("", "res/meshes/", "guitar.stl", scene, function(meshes) {
        guitarMesh = meshes[0];
        guitarMesh.scaling=new BABYLON.Vector3(0.1,0.1,0.1);
        guitarMesh.position = new BABYLON.Vector3(0, 4.1, -23.75);
    });
    BABYLON.SceneLoader.ImportMesh("", "res/meshes/", "guitar.stl", scene, function(meshes) {
        guitarMesh = meshes[0];
        guitarMesh.scaling=new BABYLON.Vector3(0.1,0.1,0.1);
        guitarMesh.position = new BABYLON.Vector3(25, 4.1, -23.75);
    });
    
    // scene.debugLayer.show();

    return scene;
}

const scene = initScene();

function update() {
    camera.updateCamera();
    updateMeshes();
}

function updateMeshes() {
    var alpha;
    for (var i = 0; i < N; i++) {
        var cylinder = scene.getMeshByName("cylinder" + i);
        cylinder.rotate(new BABYLON.Vector3(1, 0, 0), Math.PI / 100, BABYLON.Space.LOCAL);
        cylinder.position.x += 0.05;
        if (cylinder.position.x > ((N / 2) * 5)) {
            cylinder.position.x = - ((N / 2) * 5);
        }
        alpha = 1 - computeDistance(cylinder.position, new BABYLON.Vector3(0, 7.5, 0)) / (12 * 5);
        if (alpha < 0) alpha = 0;
        cylinder.material.alpha = alpha;

        var sphere = scene.getMeshByName("sphere" + i);
        sphere.position.x -= 0.05;
        if (sphere.position.x < - ((N / 2) * 5)) {
            sphere.position.x = ((N / 2) * 5);
        }
        alpha = 1 - computeDistance(sphere.position, new BABYLON.Vector3(0, 5, 0)) / (12 * 5);
        if (alpha < 0) alpha = 0;
        sphere.material.alpha = alpha;

        var box = scene.getMeshByName("box" + i);
        box.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI / 100, BABYLON.Space.LOCAL);
        box.position.x += 0.05;
        if (box.position.x > ((N / 2) * 5)) {
            box.position.x = - ((N / 2) * 5);
        }
        alpha = 1 - computeDistance(box.position, new BABYLON.Vector3(0, 2.5, 0)) / (12 * 5);
        if (alpha < 0) alpha = 0;
        box.material.alpha = alpha;
    }
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
    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
}