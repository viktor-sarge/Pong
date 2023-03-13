// TODO: Move code here to set up game loop
// Should have a method to switch to provided mode 
// Modes and their respective update/draw functions should be provided to constructor
import Messages from "./messages.js";
import AudioHandler from "./audio.js";
import GUI from "./gui.js";
import InputHandler from "./inputHandler.js";
export default class GameEngine {
    constructor(config, CONF, TEXTS) {
        this.gamestate = {
            multiplayer: false,
            paused: false,
            gameOver: false,
            running: false
        };
        this.messages = new Messages;
        this.audio = new AudioHandler;
        this.gui = new GUI(this.gamestate);
        this.canvasVars = this.gui.getCanvasVars();
        this.input = new InputHandler(this.gamestate);
        this.gameUpdateFunction;
        this.gameDrawFunction;
        this.gameOverFunction;
        this.CONF = CONF;
        this.TEXTS = TEXTS;

        this.gameLoop = () => {
            requestAnimationFrame(this.gameLoop);
            if(this.gamestate.gameOver) {
              if(this.gamestate.running) {
                this.gameOverFunction();
                this.gui.showRestart();
              }
            } else if(this.gamestate.paused){
                this.draw();
                this.messages.write(this.CONF.TEXT_SETTINGS.BIG, this.TEXTS.STATES.PAUSED, this.canvasVars.ctx, this.canvasVars.canvas);
            } else if(this.gamestate.running){
                this.update();
                this.draw();
            }
        }
    }

    registerGameOverFunction(gameOver) {
        this.gameOverFunction = gameOver;
    }
    registerUpdateLogic(update) {
        this.gameUpdateFunction = update;
    };

    registerDrawLogic(draw) {
        this.gameDrawFunction = draw;
    };

    start() {
        this.gameLoop();
    }

    update() {
        this.gameUpdateFunction();
    }

    draw() {
        this.canvasVars.ctx.clearRect(0, 0, this.canvasVars.canvasWidth, this.canvasVars.canvasHeight);
        this.gameDrawFunction();
    }

    setGameMode(mode) {

    }
}