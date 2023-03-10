export default class InputHandler {
    constructor(gameState, bindings) {
        this.keys = {};
        this.gameState = gameState;
        this.bindings = bindings; // Array of objects like {key: "KeyS", action: "moveDown", func: player}

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
        this.bindings.forEach(binding => {
            if(this.keys[binding.key]) {
                binding.func[binding.action](); 
            }
        });
    }
}