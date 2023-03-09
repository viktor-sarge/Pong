import TEXTS from './data/strings.json' assert {type: 'json'};
import scoreboard from "./objects/scoreboard.js";
import bouncemeter from "./objects/bouncemeter.js";
import Ball from "./objects/ball.js";
import Paddle from "./objects/paddle.js";
import CONF from './config/config.json' assert {type: 'json'};
import Net from "./objects/net.js";
import InputHandler from "./helpers/inputHandler.js";
import messages from "./objects/messages.js";
import countdownHandler from "./objects/countdown.js";
import gui from "./helpers/gui.js"; 

// Game state variables
let gamestate = {
  multiplayer: false,
  paused: false,
  gameOver: false,
  running: false
}

// Canvas and contex refs
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Make fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
CONF.PLAYERS[0].IDENTIFIER
);

const player2 = new Paddle(
canvas.width-CONF.PADDLE.WIDTH-CONF.PADDLE.DIST_FROM_EDGE,
canvas.height/2,
CONF.PADDLE.WIDTH,
CONF.PADDLE.BASE_HEIGHT,
CONF.GAME.BASE_COLOR,
ctx,
CONF.PLAYERS[1].IDENTIFIER
);

const net = new Net(CONF.GAME.BASE_COLOR, ctx);
const inputs = new InputHandler(gamestate);
const messageHandler = new messages(ctx, canvas);
const countdown = new countdownHandler(CONF, ctx, canvas, resetGame);
const interfaceHandler = new gui(countdown, gamestate);

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

function declareWinner() {
  let message;
  if(scorecounter.winner() === 'p1') {
    const randomIndex = Math.floor(Math.random() * TEXTS.WINNER.P1.length);
    message = TEXTS.WINNER.P1[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * TEXTS.WINNER.P2.length);
    message = TEXTS.WINNER.P2[randomIndex];
  }
  messageHandler.write(CONF.TEXT_SETTINGS.BIG, message);
  gamestate.running = false;
}

export {canvas, ctx, scorecounter, bouncecounter, net, ball, player, player2, inputs,messageHandler, canvasWidth, canvasHeight, canvasCenterX, canvasCenterY, gamestate, resetGame, declareWinner, countdown, interfaceHandler};