import Ball from "./objects/ball.js";
import Paddle from "./objects/paddle.js";
import Net from "./objects/net.js";
import scoreboard from "./objects/scoreboard.js";
import bouncemeter from "./objects/bouncemeter.js";
import TEXTS from './data/strings.json' assert {type: 'json'};
import CONF from './config/config.json' assert {type: 'json'};
import keyhandler from "./helpers/keyhandler.js";
import countdownHandler from "./objects/countdown.js";
import messages from "./objects/messages.js";
import gui from "./helpers/gui.js";   

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

// Game state variables
let gamestate = {
  multiplayer: false
}

let paused = true;
let gameOver = true;

function resetGame() {
  gameOver = false;
  paused = false;
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
}

// Helper function checking if ball moves right or left by radian angle
function anglePointingRight(angle) {
  return Math.cos(angle) > 0; // Positive cosine means right
}

const countdown = new countdownHandler(CONF, ctx, canvas, resetGame);
const interfaceHandler = new gui(countdown, gamestate);

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

// Init game objects
const scorecounter = new scoreboard();
const net = new Net(CONF.GAME.BASE_COLOR, ctx);
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
  ctx
)
const player2 = new Paddle(
  canvas.width-CONF.PADDLE.WIDTH-CONF.PADDLE.DIST_FROM_EDGE,
  canvas.height/2,
  CONF.PADDLE.WIDTH,
  CONF.PADDLE.BASE_HEIGHT,
  CONF.GAME.BASE_COLOR,
  ctx
)
const bouncecounter = new bouncemeter(
  CONF.GAME.MATCH_LENGTH_IN_BOUNCES,
  CONF.BOUNCEMETER.RADIUS,
  CONF.GAME.BASE_COLOR
);
const keyBindings = new keyhandler();
const messageHandler = new messages(ctx, canvas);

// Get controllers
let gamepads = navigator.getGamepads(); // get array of connected gamepads
let gamepad = gamepads[0];
let gamepad2 = gamepads[1];
let stickY, p2stickY;

function gameLoop() {
  requestAnimationFrame(gameLoop);

  if(!paused && !gameOver){
    update();
    draw();
  }
}

function update() {

  ball.update(canvasWidth, canvasHeight);

  // Movement by keyboard
  if (keyBindings.wPressed) {
      player.moveUp();
  } else if (keyBindings.sPressed) {
      player.moveDown(canvasHeight);
  }
  if (gamestate.multiplayer && keyBindings.arrowUpPressed) {
    player2.moveUp();
  } else if (gamestate.multiplayer && keyBindings.arrowDownPressed) {
    player2.moveDown(canvasHeight);
  }

  // Movement by gamepads
  gamepads = navigator.getGamepads();
  gamepad = gamepads[0];
  gamepad2 = gamepads[1];
  if (gamepad) { // check if gamepad exists
    // read state of left analog stick
    stickY = gamepad.axes[1];
    // map stick value to paddle movement
    if (stickY < -CONF.GAMEPAD.INPUT_THRESHOLD) { // move left paddle up
      player.moveUp();
    } else if (stickY > CONF.GAMEPAD.INPUT_THRESHOLD) { // move left paddle down
      player.moveDown(canvasHeight);
    }
  }

  if (gamepad2) { // check if gamepad exists
    // read state of left analog stick
    p2stickY = gamepad2.axes[1];
    // map stick value to paddle movement
    if (p2stickY < -CONF.GAMEPAD.INPUT_THRESHOLD) { // move left paddle up
      player2.moveUp();
    } else if (p2stickY > CONF.GAMEPAD.INPUT_THRESHOLD) { // move left paddle down
      player2.moveDown(canvasHeight);
    }
  }

  // Collision checking p1 / ball
  if(player.intersects(ball)) {
    anglePointingRight(ball.angle) 
        ? ball.x = player.x - ball.radius 
        : ball.x = player.x + player.width + ball.radius;
    ball.switchDirection();
    scorecounter.score('p1');
    player.shrink();
    player2.grow();
    bouncecounter.decrease();
    if(bouncecounter.remaining() === 0) {
      paused = true;
      gameOver = true;
    }
  }

  // Collision checking p2 / ball
  if(gamestate.multiplayer && player2.intersects(ball)) {
    anglePointingRight(ball.angle) 
        ? ball.x = player2.x - ball.radius 
        : ball.x = player2.x + player2.width + ball.radius;
    ball.switchDirection();
    scorecounter.score('p2');
    player2.shrink();
    player.grow();
    bouncecounter.decrease();
    if(bouncecounter.remaining()  === 0) {
      paused = true;
      gameOver = true;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);  // clear canvas
  net.draw(canvasWidth, canvasHeight);
  ball.draw(canvasWidth);
  player.draw();
  if(gamestate.multiplayer) player2.draw();
  scorecounter.draw(ctx, canvas);
  bouncecounter.draw(ctx, canvasCenterX, canvasCenterY);
  if(gameOver) {
    declareWinner()
    interfaceHandler.showRestart();
  } else if (paused && !gameOver) {
    messageHandler.write(CONF.TEXT_SETTINGS.BIG, TEXTS.STATES.PAUSED);
  }
}

// Start the game loop
gameLoop();