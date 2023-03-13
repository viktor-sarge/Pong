export default class GUI {
    constructor(gamestate) {

        this.gamestate = gamestate;
        this.windowResizeFunction;

        this.canvasVars = {
            canvas: document.getElementById('myCanvas')
        }
        // Add ctx to canvasVars
        this.canvasVars.ctx = this.canvasVars.canvas.getContext('2d');

        // Make canvas fullscreen
        this.canvasVars.canvas.width = window.innerWidth;
        this.canvasVars.canvas.height = window.innerHeight;

        // Add remaining values to canvasVars
        this.canvasVars.canvasWidth = this.canvasVars.canvas.width;
        this.canvasVars.canvasHeight = this.canvasVars.canvas.height;
        this.canvasVars.canvasCenterX = this.canvasVars.canvasWidth / 2;
        this.canvasVars.canvasCenterY = this.canvasVars.canvasHeight / 2;

        // Update canvas on window resize event listener
        window.addEventListener('resize', () => {
            this.canvasVars.canvas.width = window.innerWidth;
            this.canvasVars.canvas.height = window.innerHeight;

            this.canvasVars.canvasWidth = this.canvasVars.canvas.width;
            this.canvasVars.canvasHeight = this.canvasVars.canvas.height;
            this.canvasVars.canvasCenterX = this.canvasVars.canvasWidth / 2;
            this.canvasVars.canvasCenterY = this.canvasVars.canvasHeight / 2;

            this.windowResizeFunction();
        });
    }

    init(countdown) {
        this.countdown = countdown;
        this.startbutton2player = document.getElementById('startbutton2player');
        this.restartButton = document.getElementById('restartButton');
        this.startscreen = document.getElementById('startscreen');
        this.startbutton = document.getElementById('startbutton');

        // Singleplayer game start event listener
        this.startbutton.addEventListener('click', ()=>{
            this.startscreen.classList.toggle('hidden');
            this.countdown.start();
        });

        // Multiplayer game start event listener
        this.startbutton2player.addEventListener('click', ()=>{
            this.startscreen.classList.toggle('hidden');
            this.gamestate.multiplayer = true;
            this.countdown.start();
        })

        // Restart event listener
        this.restartButton.addEventListener('click', () => {
            this.restartButton.style.display = 'none';
            this.countdown.start();
        })
    }

    registerWindowResizeFunction(resizeFunction) {
        this.windowResizeFunction = resizeFunction;
    }

    showRestart() {
        this.restartButton.style.display = 'block';
    }

    getCurrentCanvas() {
        return this.canvas;
    }

    getCurrentCtx() {
        return this.ctx;
    }

    getCanvasVars(){
        return this.canvasVars;
    }

    createPage() {
        // TODO: Create canvas or full screen divs 
        // return index
    }

    setActivePage(index) {
        // TODO: Set visibility of specific pages/canvases
    }
}

// TODO: This should be refactored to be general purpose 
// * Set up any number of screens / canvases based in config
// * Have a method to show screens by ref and hide others. 
