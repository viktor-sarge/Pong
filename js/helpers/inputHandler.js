export default class InputHandler {
    constructor(gameState) {
        // Keyhandler variables
        this.arrowUpPressed = false;
        this.arrowDownPressed = false;
        this.wPressed = false;
        this.sPressed = false;
        this.gameState = gameState;

        // Keyboard controls event listers
        document.addEventListener("keydown", event => {
            switch(event.code) {
            case 'ArrowUp':
                this.arrowUpPressed = true;
                break;
            case 'ArrowDown':
                this.arrowDownPressed = true;
                break;
            case 'KeyW':
                this.wPressed = true;
                break;
            case 'KeyS':
                this.sPressed = true;
                break;
            case 'KeyP':
                this.gameState.paused = !this.gameState.paused;
                break
            }
        });

        document.addEventListener("keyup", event => {
            switch(event.code) {
            case 'ArrowUp':
                this.arrowUpPressed = false;
                break;
            case 'ArrowDown':
                this.arrowDownPressed = false;
                break;
            case 'KeyW':
                this.wPressed = false;
                break;
            case 'KeyS':
                this.sPressed = false;
                break;
            }
        });
    }
}