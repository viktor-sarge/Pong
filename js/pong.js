import Ball from "./objects/ball.js";
import Paddle from "./objects/paddle.js";
import Net from "./objects/net.js";

const startscreen = document.getElementById('startscreen');
const startbutton = document.getElementById('startbutton');
const startbutton2player = document.getElementById('startbutton2player');
let multiplayer = false;
let paused = true;
startbutton.addEventListener('click', ()=>{
  startscreen.classList.toggle('hidden');
  paused = false;
});
startbutton2player.addEventListener('click', ()=>{
  startscreen.classList.toggle('hidden');
  paused = false;
  multiplayer = true;
})

const scores = {p1:0,p2:0}

function anglePointingRight(angle) {
  return Math.cos(angle) > 0; // Positive cosine means right
}

// Keep track of the key states
let arrowUpPressed = false;
let arrowDownPressed = false;
let wPressed = false;
let sPressed = false;

// Add event listeners for keyboard events
document.addEventListener("keydown", function(event) {
    if (event.code === "ArrowUp") {
      arrowUpPressed = true;
    } else if (event.code === "ArrowDown") {
      arrowDownPressed = true;
    }
  });

  document.addEventListener("keyup", function(event) {
    if (event.code === "ArrowUp") {
      arrowUpPressed = false;
    } else if (event.code === "ArrowDown") {
      arrowDownPressed = false;
    }
  });

  document.addEventListener("keydown", function(event) {
    if (event.code === "KeyW") {
      wPressed = true;
    } else if (event.code === "KeyS") {
      sPressed = true;
    }
});

document.addEventListener("keyup", function(event) {
    if (event.code === "KeyW") {
      wPressed = false;
    } else if (event.code === "KeyS") {
      sPressed = false;
    }
});


const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bounces = 20;
const radius = 150;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;

// Update canvas dimensions on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
});

// Bounce countdown meter
function drawDots() {
  ctx.fillStyle = "white";
  for (let i = 0; i < bounces; i++) {
    const angle = i * (Math.PI * 2 / bounces);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

// Game objects
const ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 17, Math.PI / 14);
const player = new Paddle(100, canvas.height/2, 20, 100, 'white')
const player2 = new Paddle(canvas.width-20-100, canvas.height/2, 20, 100, 'white')
const net = new Net('white');

// Scoreboard function, takes an object with keys p1, p2 as input.
function drawScores(scores) {
  ctx.fillStyle = "white";
  ctx.font = "48px Vermin";
  ctx.textAlign = "center";
  ctx.fillText(scores.p1, canvas.width / 4, 60);
  ctx.fillText(scores.p2, (canvas.width / 4) * 3, 60);
}


// Controllers
let gamepads = navigator.getGamepads(); // get array of connected gamepads
let gamepad = gamepads[0];
let gamepad2 = gamepads[1];
let stickY, p2stickY;

function gameLoop() {
    // Request the next frame of the loop
    requestAnimationFrame(gameLoop);

    if(!paused){
      // Update the game state
      update();

      // Draw the game
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
  } 
  
  // Start the game loop
  gameLoop();