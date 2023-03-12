import scoreboard from "./objects/scoreboard.js";
import bouncemeter from "./objects/bouncemeter.js";
import Ball from "./objects/ball.js";
import Paddle from "./objects/paddle.js";
import CONF from '../config/config.json' assert {type: 'json'};
import Net from "./objects/net.js";
import CountdownHandler from "./objects/countdown.js";
import GameEngine from '../../engine/main.js';

// TODO: Refactor so it sets up only game specific classes

let gamestate = {
  multiplayer: false,
  paused: false,
  gameOver: false,
  running: false
}

const engine = new GameEngine({}, gamestate);

const canvas = engine.gui.getCurrentCanvas();
const ctx = engine.gui.getCurrentCtx();

// Canvas variables
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;
let canvasCenterX = canvasWidth / 2;
let canvasCenterY = canvasHeight / 2;

// Update canvas on window resize event listener
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  canvasCenterX = canvasWidth / 2;
  canvasCenterY = canvasHeight / 2;
  player2.realign(canvas.width-CONF.PADDLE.WIDTH-CONF.PADDLE.DIST_FROM_EDGE);
});

const scorecounter = new scoreboard();

const bouncecounter = new bouncemeter(
    CONF.GAME.MATCH_LENGTH_IN_BOUNCES,
    CONF.BOUNCEMETER.RADIUS,
    CONF.GAME.BASE_COLOR
  );

const ball = new Ball(
canvas.width / 2, 
canvas.height / 2, 
CONF.BALL.RADIUS, 
CONF.BALL.SPEED, 
CONF.BALL.ANGLE_RANGES,
ctx
);

const player = new Paddle(
CONF.PADDLE.DIST_FROM_EDGE,
canvas.height/2,
CONF.PADDLE.WIDTH,
CONF.PADDLE.BASE_HEIGHT,
CONF.GAME.BASE_COLOR,
ctx,
CONF.PLAYERS[0].IDENTIFIER,
canvas
);

const player2 = new Paddle(
canvas.width-CONF.PADDLE.WIDTH-CONF.PADDLE.DIST_FROM_EDGE,
canvas.height/2,
CONF.PADDLE.WIDTH,
CONF.PADDLE.BASE_HEIGHT,
CONF.GAME.BASE_COLOR,
ctx,
CONF.PLAYERS[1].IDENTIFIER,
canvas
);

const net = new Net(CONF.GAME.BASE_COLOR, ctx);
engine.input.setup(gamestate, [
  {
    func: player,
    gamepadID: 0,
    bindings: {
      keyboard: [
        {key: "KeyW", action: "moveUp"},
        {key: "KeyS", action: "moveDown"},
      ]
    }
  },
  {func: player2,
    bindings: {
      keyboard: [
        {key: "ArrowUp", action: "moveUp"},
        {key: "ArrowDown", action: "moveDown"},
      ]
    }
  }
]);
engine.input.doHackyGameSpecificSetup(player, player2, CONF.GAMEPAD.INPUT_THRESHOLD)

const countdown = new CountdownHandler(CONF, ctx, canvas, resetGame);
engine.gui.init(countdown, gamestate);

function resetGame() {
  gamestate.gameOver = false;
  gamestate.paused = false;
  gamestate.running = true;
  player.reset();
  player2.reset();
  scorecounter.reset();
  bouncecounter.reset();
  ball.serve(canvas);
}

export {canvas, ctx, scorecounter, bouncecounter, net, ball, player, player2, canvasWidth, canvasHeight, canvasCenterX, canvasCenterY, gamestate, resetGame, countdown, engine};