import Ball from "./objects/ball.js";
import Paddle from "./objects/paddle.js";
import Net from "./objects/net.js";

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

const ball = new Ball(canvas.width / 2, canvas.height / 2, 10, 7, Math.PI / 14);
const player = new Paddle(100, canvas.height/2, 20, 100, 'white')
const net = new Net('white');

function gameLoop() {
    // Request the next frame of the loop
    requestAnimationFrame(gameLoop);

    // Update the game state
    update();

    // Draw the game
    draw();
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
    }
    
  }
  
  function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    net.draw(ctx, canvas);
    ball.draw(ctx);
    player.draw(ctx);
  }
  
  // Start the game loop
  gameLoop();