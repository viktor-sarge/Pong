import Ball from "./objects/ball.js";
import Paddle from "./objects/paddle.js";
import Net from "./objects/net.js";

const startscreen = document.getElementById('startscreen');
const startbutton = document.getElementById('startbutton');
let paused = true;
startbutton.addEventListener('click', ()=>{
  startscreen.classList.toggle('hidden');
  paused = false;
});

const scores = {p1:0,p2:0}

function anglePointingRight(angle) {
  return Math.cos(angle) > 0; // Positive cosine means right
}

// Keep track of the arrow key states
let arrowUpPressed = false;
let arrowDownPressed = false;

// Add event listeners for arrow key events
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

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Update canvas dimensions on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

let bounces = 20;
const radius = 150;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

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

const ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 17, Math.PI / 14);
const player = new Paddle(100, canvas.height/2, 20, 100, 'white')
const net = new Net('white');

function drawScores(scores) {
  ctx.fillStyle = "white";
  ctx.font = "48px Vermin";
  ctx.textAlign = "center";
  ctx.fillText(scores.p1, canvas.width / 4, 60);
  ctx.fillText(scores.p2, (canvas.width / 4) * 3, 60);
}

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
    
    if (arrowUpPressed) {
        player.moveUp();
    } else if (arrowDownPressed) {
        player.moveDown(canvas);
    }
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
  }
  
  function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    net.draw(ctx, canvas);
    ball.draw(ctx, canvas);
    player.draw(ctx);
    drawScores(scores);
    drawDots();
  } 
  
  // Start the game loop
  gameLoop();