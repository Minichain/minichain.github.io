class Camera {
    constructor(canvas, scene) {
        this.camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 5, -75), scene);

        this.camera.applyGravity = true;
        this.camera.ellipsoid = new BABYLON.Vector3(2.5, 2.5, 2.5);
        this.camera.checkCollisions = true;
        this.camera.attachControl(canvas, false);
        this.camera.speed = 2.5;
        this.camera.inertia = 0.1;
        this.camera.angularSensibility = 750;

        this.camera.keysUp = [87];      //W
        this.camera.keysDown = [83];    //A
        this.camera.keysLeft = [65];    //S
        this.camera.keysRight = [68];   //D
    }

    update() {
        this.camera.speed = InputListener.isShiftKeyPressed ? 5 : 2.5;
    }    

    getCamera() {
        return this.camera;
    }
}