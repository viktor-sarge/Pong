export default class Ball {
    constructor(x, y, radius, speed, angle) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.speed = speed;
      this.angle = angle;
    }
  
    update(canvas) {
      // Move the ball based on its speed and angle
      this.x += this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);
  
      // Check if the ball collides with the canvas boundaries
      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.angle = Math.PI - this.angle;
      }
      if (this.x + this.radius > canvas.width) {
        this.x = canvas.width - this.radius;
        this.angle = Math.PI - this.angle;
      }
      if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.angle = -this.angle;
      }
      if (this.y + this.radius > canvas.height) {
        this.y = canvas.height - this.radius;
        this.angle = -this.angle;
      }
    }
  
    draw(ctx) {
      // Draw the ball as a circle
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
    }
  }