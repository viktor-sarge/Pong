import TEXTS from './data/strings.json' assert {type: 'json'};
import CONF from './config/config.json' assert {type: 'json'};

import {
  ctx,
  canvas, 
  scorecounter, 
  bouncecounter, 
  net, 
  ball, 
  player, 
  player2,
  keyBindings,
  messageHandler, 
  canvasCenterX,
  canvasCenterY, 
  canvasHeight,
  canvasWidth,
  gamestate, 
  declareWinner,
  interfaceHandler } from "./setup.js";

// Helper function checking if ball moves right or left by radian angle
function anglePointingRight(angle) {
  return Math.cos(angle) > 0; // Positive cosine means right
}

const soundBounce = new Howl({
  src: ['../score.mp3']
});

// Get controllers
let gamepads = navigator.getGamepads(); // get array of connected gamepads
let gamepad = gamepads[0];
let gamepad2 = gamepads[1];
let stickY, p2stickY;

function gameLoop() {
  requestAnimationFrame(gameLoop);

  if(!gamestate.paused && !gamestate.gameOver){
    update();
    draw();
  }
}

function checkCollisions(player, opponent, ball) {
  // Collision checking player / ball
  if(player.intersects(ball)) {
    anglePointingRight(ball.angle) 
        ? ball.x = player.x - ball.radius 
        : ball.x = player.x + player.width + ball.radius;
    ball.switchDirection();
    scorecounter.score(player.id);
    player.shrink();
    opponent.grow();
    bouncecounter.decrease();
    soundBounce.play();
    if(bouncecounter.remaining() === 0) {
      gamestate.paused = true;
      gamestate.gameOver = true;
    }
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

  checkCollisions(player, player2, ball);
  checkCollisions(player2, player, ball);
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);  // clear canvas
  net.draw(canvasWidth, canvasHeight);
  ball.draw(canvasWidth);
  player.draw();
  if(gamestate.multiplayer) player2.draw();
  scorecounter.draw(ctx, canvas);
  bouncecounter.draw(ctx, canvasCenterX, canvasCenterY);
  if(gamestate.gameOver) {
    declareWinner()
    interfaceHandler.showRestart();
  } else if (gamestate.paused && !gamestate.gameOver) {
    messageHandler.write(CONF.TEXT_SETTINGS.BIG, TEXTS.STATES.PAUSED);
  }
}

// Start the game loop
gameLoop();