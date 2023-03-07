export default class keyhandler {
    constructor() {
        // Keyhandler variables
        this.arrowUpPressed = false;
        this.arrowDownPressed = false;
        this.wPressed = false;
        this.sPressed = false;

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