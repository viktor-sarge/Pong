export default class gui {
    constructor(countdown, gamestate) {
        this.gamestate = gamestate;
        this.startbutton2player = document.getElementById('startbutton2player');
        this.restartButton = document.getElementById('restartButton');
        this.startscreen = document.getElementById('startscreen');
        this.startbutton = document.getElementById('startbutton');

        // Singleplayer game start event listener
        this.startbutton.addEventListener('click', ()=>{
            startscreen.classList.toggle('hidden');
            countdown.start();
        });

        // Multiplayer game start event listener
        this.startbutton2player.addEventListener('click', ()=>{
            startscreen.classList.toggle('hidden');
            this.gamestate.multiplayer = true;
            countdown.start();
        })

        // Restart event listener
        this.restartButton.addEventListener('click', () => {
            restartButton.style.display = 'none';
            countdown.start();
        })
    }

    showRestart() {
        this.restartButton.style.display = 'block';
    }
}

// TODO: This should be refactored to ge general purpose 
// Should: 
// * take config of nr/type of screens (canvas / full screen divs) and a ref
// * Have a method to show screens by ref and hide others. 
