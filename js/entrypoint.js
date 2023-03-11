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

import * as helpers from './game/helpers/helperFunctions.js';

const soundBounce = new Howl({
  src: ['../score.mp3']
});

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
    helpers.anglePointingRight(ball.angle) 
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