export default class GUI {
    constructor(countdown, gamestate) {
        // Canvas and contex refs
        this.canvas = document.getElementById('myCanvas');
        this.ctx = this.canvas.getContext('2d');
        // this.gamestate = gamestate;
    }

    init(countdown, gamestate) {
        this.countdown = countdown;
        this.gamestate = gamestate;
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

    showRestart() {
        this.restartButton.style.display = 'block';
    }

    getCurrentCanvas() {
        return this.canvas;
    }

    getCurrentCtx() {
        return this.ctx;
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
