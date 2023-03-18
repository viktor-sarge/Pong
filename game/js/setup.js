import scoreboard from "./objects/scoreboard.js";
import bouncemeter from "./objects/bouncemeter.js";
import Ball from "./objects/ball.js";
import Paddle from "./objects/paddle.js";
import CONF from '../config/config.json' assert {type: 'json'};
import Net from "./objects/net.js";
import CountdownHandler from "./objects/countdown.js";
import GameEngine from '../../engine/main.js';
import TEXTS from '../data/strings.json' assert {type: 'json'};
import * as helpers from './helpers/helperFunctions.js';
import OpponentAI from "./objects/opponentAI.js";

/* Game engine instantiation */
const engine = new GameEngine(CONF, TEXTS);
const canvasVars = engine.gui.getCanvasVars();

/* Game specific classes initialized here */ 
const scorecounter = new scoreboard();

const bouncecounter = new bouncemeter({
  bounces: CONF.GAME.MATCH_LENGTH_IN_BOUNCES,
  radius: CONF.BOUNCEMETER.RADIUS,
  color: CONF.BOUNCEMETER.COLOR
});

const ball = new Ball(
  canvasVars.canvasWidth / 2, 
  canvasVars.canvasHeight / 2, 
  CONF.BALL.RADIUS, 
  CONF.BALL.SPEED, 
  CONF.BALL.ANGLE_RANGES,
  canvasVars.ctx,
  canvasVars.canvas,
  engine.audio,
  engine.physics
);

const player = new Paddle(
  CONF.PADDLE.DIST_FROM_EDGE,
  canvasVars.canvasHeight/2,
  CONF.PADDLE.WIDTH,
  CONF.PADDLE.BASE_HEIGHT,
  CONF.GAME.BASE_COLOR,
  canvasVars.ctx,
  CONF.PLAYERS[0].IDENTIFIER,
  canvasVars.canvas,
  "left",
  CONF.PADDLE.DIST_FROM_EDGE,
  engine.audio
);

const player2 = new Paddle(
  canvasVars.canvasWidth-CONF.PADDLE.WIDTH-CONF.PADDLE.DIST_FROM_EDGE,
  canvasVars.canvasHeight/2,
  CONF.PADDLE.WIDTH,
  CONF.PADDLE.BASE_HEIGHT,
  CONF.GAME.BASE_COLOR,
  canvasVars.ctx,
  CONF.PLAYERS[1].IDENTIFIER,
  canvasVars.canvas,
  "right",
  CONF.PADDLE.DIST_FROM_EDGE,
  engine.audio
);

const opponent = new OpponentAI(ball, player2, canvasVars.canvas);

const net = new Net(CONF.GAME.BASE_COLOR, canvasVars.ctx);

/* Window resize / game specific */
function resize() {
  player2.realign(canvasVars.canvasWidth-CONF.PADDLE.WIDTH-CONF.PADDLE.DIST_FROM_EDGE);
}

/* Countdown and reset / game specific / GUI */
function resetGame() {
  engine.gamestate.gameOver = false;
  engine.gamestate.paused = false;
  engine.gamestate.running = true;
  player.reset();
  player2.reset();
  scorecounter.reset();
  bouncecounter.reset();
  ball.serve();
}
const countdown = new CountdownHandler(CONF, canvasVars.ctx, canvasVars.canvas, resetGame, engine.audio, engine.messages);

const soundBounce = engine.audio.registerSound('game/audio/score.mp3');

function checkCollisions(player, opponent, ball) {
  // Collision checking player / ball
  if(engine.collisions.check(ball, player)) {
    helpers.anglePointingRight(ball.angle) 
        ? ball.x = player.x - ball.radius 
        : ball.x = player.x + player.width + ball.radius;
    ball.switchDirection();
    ball.accelerate();
    scorecounter.score(player.id);
    player.shrink();
    opponent.grow();
    bouncecounter.decrease();
    engine.audio.play(soundBounce);
    if(bouncecounter.remaining() === 0) {
      engine.gamestate.paused = true;
      engine.gamestate.gameOver = true;
    }
  }
}

function update() {
  ball.update(canvasVars.canvasWidth, canvasVars.canvasHeight);
  if(ball.getSpeed() === 0) {
    if(ball.getSide() === 'left') {
      scorecounter.doublePoints('p2');
      ball.serve();
    } else {
      scorecounter.doublePoints('p1');
      ball.serve();
    }
  }
  engine.input.update()
  if(!engine.gamestate.multiplayer) opponent.update();
  checkCollisions(player, player2, ball);
  checkCollisions(player2, player, ball);
}

function draw() {
  net.draw(canvasVars.canvasWidth, canvasVars.canvasHeight);
  ball.draw(canvasVars.canvasWidth);
  player.draw();
  player2.draw();
  scorecounter.draw(canvasVars.ctx, canvasVars.canvas);
  bouncecounter.draw(canvasVars.ctx, canvasVars.canvasCenterX, canvasVars.canvasCenterY);
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
  engine.messages.write(CONF.TEXT_SETTINGS.BIG, message, canvasVars.ctx, canvasVars.canvas);
  engine.gamestate.running = false;
}

/* Registering game specifics with engine */ 
engine.input.setup([
  {
    func: player,
    gamepadID: 0,
    gamepadInputThreshold: CONF.GAMEPAD.INPUT_THRESHOLD,
    bindings: {
      keyboard: [
        {key: "KeyW", action: "moveUp"},
        {key: "KeyS", action: "moveDown"},
        {key: "KeyB", action: "boost"},
      ],
      gamepad: {
        leftStickUp: "moveUp",
        leftStickDown: "moveDown",
        buttons: {
          0: "boost"
        }
      }
    }
  },
  { 
    func: player2,
    gamepadID: 1,
    gamepadInputThreshold: CONF.GAMEPAD.INPUT_THRESHOLD,
    bindings: {
      keyboard: [
        {key: "ArrowUp", action: "moveUp"},
        {key: "ArrowDown", action: "moveDown"},
        {key: "KeyL", action: "boost"},
      ],
      gamepad: {
        leftStickUp: "moveUp",
        leftStickDown: "moveDown",
        buttons: {
          0: "boost"
        }
      }
    }
  }
]);

engine.gui.registerWindowResizeFunction(resize);
engine.gui.init(countdown);
engine.registerUpdateLogic(update);
engine.registerDrawLogic(draw);
engine.registerGameOverFunction(declareWinner);

// Start the game loop
engine.start();
