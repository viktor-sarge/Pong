export default class Ball {
    constructor(x, y, radius, speed) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.speed = speed;
      this.angle = this.getRandomAngle();
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
  
    draw(ctx, canvas) {

      // Set the shadow color, offset, and blur
      ctx.shadowColor = 'lightgray';
      ctx.shadowBlur = 25;

      // Calculate the distance between the ball and the center of the screen
      const distanceFromCenter = canvas.width / 2 - Math.abs(this.x - canvas.width / 2);

      // Calculate the offset of the shadow based on the distance from the center
      const shadowOffset = Math.max(10, (distanceFromCenter / 5));

      ctx.save()
      // Set the shadow offset based on the distance from the center
      ctx.shadowOffsetY = shadowOffset;

      // Draw the ball as a circle
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }

    serve(canvas) {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.angle = this.getRandomAngle();
    }

    // Helper function to create random angles for the ball
    getRandomAngle() {
      const angleRanges = [
        [2.55, 2.85], [0.3, 0.6],
        [3.45, 3.75], [5.7, 6.0]]; // The ranges in radians
      const randomRangeIndex = Math.floor(Math.random() * angleRanges.length);
      const [minAngle, maxAngle] = angleRanges[randomRangeIndex];
      return Math.random() * (maxAngle - minAngle) + minAngle;
    }
  }