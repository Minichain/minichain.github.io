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
        var speed = InputListener.isShiftKeyPressed ? 0.30 : 0.15;
        var frontVector = this.camera.getFrontPosition(1).subtract(this.camera.position).normalize();
        var movementVector = new BABYLON.Vector3(0, 0, 0);
        if (InputListener.isWKeyPressed) {
            movementVector.x += frontVector.x;
            movementVector.z += frontVector.z;
        }
        if (InputListener.isSKeyPressed) {
            movementVector.x -= frontVector.x;
            movementVector.z -= frontVector.z;
        }
        var matrix = BABYLON.Matrix.RotationAxis(BABYLON.Axis.Y, Math.PI / 2);
        var sideVector = BABYLON.Vector3.TransformCoordinates(frontVector, matrix).normalize();
        if (InputListener.isAKeyPressed) {
            movementVector.x -= sideVector.x;
            movementVector.z -= sideVector.z;
        }
        if (InputListener.isDKeyPressed) {
            movementVector.x += sideVector.x;
            movementVector.z += sideVector.z;
        }

        movementVector.normalize();
        this.camera.position.x += speed * movementVector.x;
        this.camera.position.y += speed * movementVector.y;
        this.camera.position.z += speed * movementVector.z;

        var minYPosition = 5;
        if (this.camera.position.y < minYPosition) {
            this.camera.position.y = minYPosition;
        }
    }    

    getCamera() {
        return this.camera;
    }
}