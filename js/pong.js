import Ball from "./objects/ball.js";
import Paddle from "./objects/paddle.js";
import Net from "./objects/net.js";

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
let gameOver = false;
const scores = {p1:0,p2:0}
let bounces = 21;

// Config values
const bounceMeterRadius = 150;

// Keyhandler variables
let arrowUpPressed = false;
let arrowDownPressed = false;
let wPressed = false;
let sPressed = false;

// Helper function checking if ball moves right or left by radian angle
function anglePointingRight(angle) {
  return Math.cos(angle) > 0; // Positive cosine means right
}

// Bounce countdown meter
function drawDots() {
  ctx.fillStyle = "white";
  for (let i = 0; i < bounces; i++) {
    const angle = i * (Math.PI * 2 / bounces);
    const x = canvasCenterX + bounceMeterRadius * Math.cos(angle);
    const y = canvasCenterY + bounceMeterRadius * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

// Scoreboard function, takes an object with keys p1, p2 as input.
function drawScores(scores) {
  ctx.fillStyle = "white";
  ctx.font = "48px Vermin";
  ctx.textAlign = "center";
  ctx.fillText(scores.p1, canvas.width / 4, 60);
  ctx.fillText(scores.p2, (canvas.width / 4) * 3, 60);
}

// Single player gamestart event listener
startbutton.addEventListener('click', ()=>{
  startscreen.classList.toggle('hidden');
  paused = false;
});

// Multiplayer game start event listener
startbutton2player.addEventListener('click', ()=>{
  startscreen.classList.toggle('hidden');
  paused = false;
  multiplayer = true;
})

// Restart event listener
restartButton.addEventListener('click', () => {
  restartButton.style.display = 'none';

  // reset the game
  gameOver = false;
  paused = false;
  scores.p1 = 0;
  scores.p2 = 0;
  bounces = 21;
  ball.serve(canvas);
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
    scores.p1++;
    bounces--;
    if(bounces === 0) {
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
    scores.p2++;
    bounces--;
    if(bounces === 0) {
      paused = true;
      gameOver = true;
    }
  }
}

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  net.draw(ctx, canvas);
  ball.draw(ctx, canvas);
  player.draw(ctx);
  if(multiplayer) player2.draw(ctx);
  drawScores(scores);
  drawDots();
  if(gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "96px Vermin";
    ctx.textAlign = "center";
    const message = scores.p1 > scores.p2 ? 'Player 1 wins' : 'Player 2 wins';
    ctx.fillText(message, canvas.width / 2, canvas.height/2);
    // show the restart button
    restartButton.style.display = 'block';
  } else if (paused && !gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "96px Vermin";
    ctx.textAlign = "center";
    ctx.fillText('Paused', canvas.width / 2, canvas.height/2);
  }
}

// Start the game loop
gameLoop();