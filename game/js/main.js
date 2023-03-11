import TEXTS from '../data/strings.json' assert {type: 'json'};
import CONF from '../config/config.json' assert {type: 'json'};

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
  canvasCenterX,
  canvasCenterY, 
  canvasHeight,
  canvasWidth,
  gamestate, 
  engine } from "./setup.js";

import * as helpers from './helpers/helperFunctions.js';

// TODO: Refactor so it imports the engine and provides config with update/draw methods for game modes


const soundBounce = engine.audio.registerSound('game/audio/score.mp3');

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if(gamestate.gameOver) {
    if(gamestate.running) {
      declareWinner()
      engine.gui.showRestart();
    }
  } else if(gamestate.paused){
    draw();
    engine.messages.write(CONF.TEXT_SETTINGS.BIG, TEXTS.STATES.PAUSED, ctx, canvas);
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
    // soundBounce.play();
    engine.audio.play(soundBounce);
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

function declareWinner() {
  let message;
  if(scorecounter.winner() === 'p1') {
    const randomIndex = Math.floor(Math.random() * TEXTS.WINNER.P1.length);
    message = TEXTS.WINNER.P1[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * TEXTS.WINNER.P2.length);
    message = TEXTS.WINNER.P2[randomIndex];
  }
  engine.messages.write(CONF.TEXT_SETTINGS.BIG, message, ctx, canvas);
  gamestate.running = false;
}

// Start the game loop
gameLoop();