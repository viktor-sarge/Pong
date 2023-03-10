export default class InputHandler {
    constructor(gameState, bindings, player, player2, INPUT_THRESHOLD ) {
        this.keys = {};
        this.gameState = gameState;
        this.bindings = bindings;

        this.player = player;
        this.player2 = player2;
        // Get controllers
        this.gamepads = navigator.getGamepads(); // get array of connected gamepads
        this.gamepad = this.gamepads[0];
        this.gamepad2 = this.gamepads[1];
        this.stickY;
        this.p2stickY;
        this.INPUT_THRESHOLD = INPUT_THRESHOLD;

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
    update() {
        // Runs provided action on provided func if .key is true in keys{}
        this.bindings.forEach(group => {
            group.bindings.keyboard.forEach(binding => {
                if(this.keys[binding.key]) {
                    group.func[binding.action](); 
                }
            })
        });

        // Movement by gamepads
        this.gamepads = navigator.getGamepads();
        this.gamepad = this.gamepads[0];
        this.gamepad2 = this.gamepads[1];

        [{gamepad: this.gamepad, player: this.player}, 
         {gamepad: this.gamepad2, player: this.player2}
        ].forEach(entry => {
            if (entry.gamepad) {
                // read state of left analog stick
                this.stickY = entry.gamepad.axes[1];
                // map stick value to paddle movement
                if (this.stickY < -this.INPUT_THRESHOLD) { // move left paddle up
                    entry.player.moveUp();
                } else if (this.stickY > this.INPUT_THRESHOLD) { // move left paddle down
                    entry.player.moveDown();
                }
            }
        })
    }
}