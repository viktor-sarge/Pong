import Ball from "./objects/ball.js";
import Paddle from "./objects/paddle.js";
import Net from "./objects/net.js";
import scoreboard from "./objects/scoreboard.js";
import bouncemeter from "./objects/bouncemeter.js";

// Canvas and contex refs
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get canvas center x,y
let canvasCenterX = canvas.width / 2;
let canvasCenterY = canvas.height / 2;

// HTML element refs
const startscreen = document.getElementById('startscreen');
const startbutton = document.getElementById('startbutton');
const startbutton2player = document.getElementById('startbutton2player');
const restartButton = document.getElementById('restartButton');

// Game state variables
let multiplayer = false;
let paused = true;
let gameOver = true;

// Keyhandler variables
let arrowUpPressed = false;
let arrowDownPressed = false;
let wPressed = false;
let sPressed = false;

// Game restart related variables
let countdown = 3;
let timerIntervalId;

function resetGame() {
  gameOver = false;
  paused = false;
  scorecounter.reset();
  bouncecounter.reset();
  ball.serve(canvas);
}
function startCountdown() {
  // Start countdown until game restart
  timerIntervalId = setInterval(() => {
    if (countdown > 0) {
      // clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // write the countdown on the canvas
      ctx.fillStyle = "white";
      ctx.font = '96px Vermin';
      console.log(countdown, canvas.width / 2, canvas.height / 2);
      ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);

      countdown--;
    } else {
      // clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      resetGame()

      // stop the timer
      clearInterval(timerIntervalId);
      countdown = 3;
    }
  }, 1000);
}

// Helper function checking if ball moves right or left by radian angle
function anglePointingRight(angle) {
  return Math.cos(angle) > 0; // Positive cosine means right
}

// Single player gamestart event listener
startbutton.addEventListener('click', ()=>{
  startscreen.classList.toggle('hidden');

  // Immediately display the first number of the countdown
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = '96px Vermin';
  ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
  countdown--;

  startCountdown();
});

// Multiplayer game start event listener
startbutton2player.addEventListener('click', ()=>{
  startscreen.classList.toggle('hidden');
  multiplayer = true;

  // Immediately display the first number of the countdown
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = '96px Vermin';
  ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
  countdown--;

  startCountdown();
})

// Restart event listener
restartButton.addEventListener('click', () => {
  restartButton.style.display = 'none';

  // Immediately display the first number of the countdown
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = '96px Vermin';
  ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
  countdown--;
  startCountdown();
})

// Keyboard controls event listers
document.addEventListener("keydown", function(event) {
    switch(event.code) {
      case 'ArrowUp':
        arrowUpPressed = true;
        break;
      case 'ArrowDown':
        arrowDownPressed = true;
        break;
      case 'KeyW':
        wPressed = true;
        break;
      case 'KeyS':
        sPressed = true;
        break;
    }
  });

  document.addEventListener("keyup", function(event) {
    switch(event.code) {
      case 'ArrowUp':
        arrowUpPressed = false;
        break;
      case 'ArrowDown':
        arrowDownPressed = false;
        break;
      case 'KeyW':
        wPressed = false;
        break;
      case 'KeyS':
        sPressed = false;
        break;
    }
  });

// Update canvas on window resize event listener
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvasCenterX = canvas.width / 2;
  canvasCenterY = canvas.height / 2;
});

// Init game objects
const ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 17, Math.PI / 14);
const player = new Paddle(100, canvas.height/2, 20, 100, 'white')
const player2 = new Paddle(canvas.width-20-100, canvas.height/2, 20, 100, 'white')
const net = new Net('white');
const scorecounter = new scoreboard();
const bouncecounter = new bouncemeter(21,150, 'white');

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

  // Check if the arrow up or arrow down key is pressed and call the corresponding method on the paddle
  ball.update(canvas);

  // Movement by keyboard
  if (wPressed) {
      player.moveUp();
  } else if (sPressed) {
      player.moveDown(canvas);
  }
  if (multiplayer && arrowUpPressed) {
    player2.moveUp();
  } else if (multiplayer && arrowDownPressed) {
    player2.moveDown(canvas);
  }

  // Movement by gamepads
  gamepads = navigator.getGamepads();
  gamepad = gamepads[0];
  gamepad2 = gamepads[1];
  if (gamepad) { // check if gamepad exists
    // read state of left analog stick
    stickY = gamepad.axes[1];
    // map stick value to paddle movement
    if (stickY < -0.5) { // move left paddle up
      player.moveUp(canvas);
    } else if (stickY > 0.5) { // move left paddle down
      player.moveDown(canvas);
    }
  }

  if (gamepad2) { // check if gamepad exists
    // read state of left analog stick
    p2stickY = gamepad2.axes[1];
    // map stick value to paddle movement
    if (p2stickY < -0.5) { // move left paddle up
      player2.moveUp(canvas);
    } else if (p2stickY > 0.5) { // move left paddle down
      player2.moveDown(canvas);
    }
  }

  // Collision checking p1 / ball
  if(player.intersects(ball)) {
    anglePointingRight(ball.angle) 
        ? ball.x = player.x - ball.radius 
        : ball.x = player.x + player.width + ball.radius;
    ball.angle = Math.PI - ball.angle;
    scorecounter.score('p1');
    bouncecounter.decrease();
    if(bouncecounter.remaining() === 0) {
      paused = true;
      gameOver = true;
    }
  }

  // Collision checking p2 / ball
  if(multiplayer && player2.intersects(ball)) {
    anglePointingRight(ball.angle) 
        ? ball.x = player2.x - ball.radius 
        : ball.x = player2.x + player2.width + ball.radius;
    ball.angle = Math.PI - ball.angle;
    scorecounter.score('p2');
    bouncecounter.decrease();
    if(bouncecounter.remaining()  === 0) {
      paused = true;
      gameOver = true;
    }
  }
}

function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas
  net.draw(ctx, canvas);
  ball.draw(ctx, canvas);
  player.draw(ctx);
  if(multiplayer) player2.draw(ctx);
  scorecounter.draw(ctx, canvas);
  bouncecounter.draw(ctx, canvasCenterX, canvasCenterY);
  if(gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "96px Vermin";
    ctx.textAlign = "center";
    const message = scorecounter.winner() === 'p1' ? 'Player 1 wins' : 'Player 2 wins';
    ctx.fillText(message, canvas.width / 2, canvas.height/2);
    restartButton.style.display = 'block'; // Show restart button
  } else if (paused && !gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "96px Vermin";
    ctx.textAlign = "center";
    ctx.fillText('Paused', canvas.width / 2, canvas.height/2);
  }
}

// Start the game loop
gameLoop();