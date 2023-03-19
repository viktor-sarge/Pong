import Messages from "./messages.js";
import AudioHandler from "./audio.js";
import GUI from "./gui.js";
import InputHandler from "./inputHandler.js";
import Collisions from "./collisions.js";
import Physics from "./physics.js";
import ParticleSystem from "./particles/particles.js";
export default class GameEngine {
    constructor(CONF, TEXTS) {
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
        this.collisions = new Collisions();
        this.physics = new Physics(CONF.PHYSICS.FRICTION);
        this.particles = new ParticleSystem(this.canvasVars.ctx);
        this.gameUpdateFunction;
        this.gameDrawFunction;
        this.gameOverFunction;
        this.CONF = CONF;
        this.TEXTS = TEXTS;
        this.lastFrameTime = 0;
        this.deltaTime = 0;

        this.gameLoop = (timestamp) => {
            this.deltaTime = (timestamp - this.lastFrameTime) / 1000;
            this.lastFrameTime = timestamp;

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
            requestAnimationFrame(this.gameLoop);
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
        requestAnimationFrame(this.gameLoop);
    }

    update() {
        this.particles.update(this.deltaTime);
        this.gameUpdateFunction();
    }

    draw() {
        this.canvasVars.ctx.clearRect(0, 0, this.canvasVars.canvasWidth, this.canvasVars.canvasHeight);
        this.particles.render();
        this.gameDrawFunction();
    }
}