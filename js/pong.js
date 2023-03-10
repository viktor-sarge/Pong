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
  inputs,
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
  if(gamestate.gameOver) {
    if(gamestate.running) {
      declareWinner()
      interfaceHandler.showRestart();
    }
  } else if(gamestate.paused){
    draw();
    messageHandler.write(CONF.TEXT_SETTINGS.BIG, TEXTS.STATES.PAUSED);
  } else if(gamestate.running){
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
  inputs.update()

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
  if(gamestate.multiplayer) checkCollisions(player2, player, ball);
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);  // clear canvas
  net.draw(canvasWidth, canvasHeight);
  ball.draw(canvasWidth);
  player.draw();
  if(gamestate.multiplayer) player2.draw();
  scorecounter.draw(ctx, canvas);
  bouncecounter.draw(ctx, canvasCenterX, canvasCenterY);
}

// Start the game loop
gameLoop();