export default class Paddle {
    constructor(x, y, width, height, color) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.color = color;
      this.speed = 7;
    }
  
    moveUp() {
      if(this.y - this.speed > 0) this.y -= this.speed;
    }
  
    moveDown(canvas) {
        if(this.y + this.height + this.speed < canvas.height) this.y += this.speed;
    }
  
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    intersects(ball) {
      // Check if the ball is within the left and right edges of the paddle
      let ballX = ball.x + ball.radius;
      if (ballX < this.x || ballX > this.x + this.width) {
          return false;
      }

      // Check if the ball is within the top and bottom edges of the paddle
      let ballY = ball.y + ball.radius;
      if (ballY < this.y || ballY > this.y + this.height) {
          return false;
      }

      // If the ball is within both the horizontal and vertical edges of the paddle, it intersects with the paddle
      return true;
    }
  }