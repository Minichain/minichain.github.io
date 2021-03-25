class Camera {
    constructor(canvas, scene) {
        this.camera = new BABYLON.UniversalCamera("UniversalCamera", new BABYLON.Vector3(0, 5, -75), scene);

        // Attach the camera to the canvas
        this.camera.applyGravity = true;
        this.camera.ellipsoid = new BABYLON.Vector3(2.5, 5, 2.5);
        this.camera.checkCollisions = true;
        this.camera.attachControl(canvas, false);     
    }

    updateCamera() {
        var speed = InputListener.isShiftKeyPressed ? 0.5 : 0.25;
        var frontVector = this.camera.getFrontPosition(1).subtract(this.camera.position).normalize();
        if (InputListener.isWKeyPressed) {
            this.camera.position.x += speed * frontVector.x;
            this.camera.position.z += speed * frontVector.z;
        }
        if (InputListener.isSKeyPressed) {
            this.camera.position.x -= speed * frontVector.x;
            this.camera.position.z -= speed * frontVector.z;
        }
        var matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI / 2);
        var sideVector = BABYLON.Vector3.TransformCoordinates(frontVector, matrix).normalize();
        if (InputListener.isAKeyPressed) {
            this.camera.position.x -= speed * sideVector.x;
            this.camera.position.z -= speed * sideVector.z;
        }
        if (InputListener.isDKeyPressed) {
            this.camera.position.x += speed * sideVector.x;
            this.camera.position.z += speed * sideVector.z;
        }
    }    

    getCamera() {
        return this.camera;
    }
}