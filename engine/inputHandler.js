export default class InputHandler {
    constructor(gameState) {
        this.keys = {};
        this.gameState = gameState;
        this.bindings;

        // Get connected gamepads array
        this.gamepads = navigator.getGamepads();
        this.stickY;

        document.addEventListener("keydown", event => {
            if(event.code === "KeyP") {
                this.gameState.paused = !this.gameState.paused;
            }
            else {
                this.keys[event.code] = true;
            }
        });

        document.addEventListener("keyup", event => {
            this.keys[event.code] = false;
        });
    }

    setup(bindings) {
        this.bindings = bindings;
    }

    update() {
        // Runs provided action on provided func if .key is true in keys{}
        this.gamepads = navigator.getGamepads();
        this.bindings.forEach(group => {
            group.bindings.keyboard.forEach(binding => {
                if(this.keys[binding.key]) {
                    group.func[binding.action](); 
                }
            });

            if (this.gamepads[group.gamepadID]) {
                // read state of left analog stick
                this.stickY = this.gamepads[group.gamepadID].axes[1];
                // map stick value to paddle movement
                if (this.stickY < -group.gamepadInputThreshold) { // move left paddle up
                    group.func[group.bindings.gamepad.leftStickUp]();
                } else if (this.stickY > group.gamepadInputThreshold) { // move left paddle down
                    group.func[group.bindings.gamepad.leftStickDown]();
                }
            }
        });
    }
}