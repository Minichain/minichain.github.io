class InputListener {
    static isWKeyPressed;
    static isAKeyPressed;
    static isSKeyPressed;
    static isDKeyPressed;
    static isShiftKeyPressed;

    static initInputListener(canvas) {
        canvas.addEventListener("keydown", function(event) {
            InputListener.setKeyPressed(event.key, true);
        });
    
        canvas.addEventListener("keyup", function(event) {
            InputListener.setKeyPressed(event.key, false);
        });    
    }

    static setKeyPressed(key, pressed) {
        if (key === "w" || key ==="W") {
            InputListener.isWKeyPressed = pressed;
        } else if (key === "a" || key ==="A") {
            InputListener.isAKeyPressed = pressed;
        } else if (key === "s" || key ==="S") {
            InputListener.isSKeyPressed = pressed;
        } else if (key === "d" || key ==="D") {
            InputListener.isDKeyPressed = pressed;
        } else if (key === "Shift") {
            InputListener.isShiftKeyPressed = pressed;
        } else {
            console.log("Key pressed ignored: " + key);
        }
    }
}