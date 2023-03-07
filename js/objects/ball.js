export default class Ball {
    constructor(x, y, radius, speed, angleRanges, ctx) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.speed = speed;
      this.angleRanges = angleRanges;
      this.angle = this.getRandomAngle();
      this.ctx = ctx;
    }

    update(canvasWidth, canvasHeight) {
      // Move the ball based on its speed and angle
      this.x += this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);
  
      // Check if the ball collides with the canvas boundaries
      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.angle = Math.PI - this.angle;
      }
      if (this.x + this.radius > canvasWidth) {
        this.x = canvasWidth - this.radius;
        this.angle = Math.PI - this.angle;
      }
      if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.angle = -this.angle;
      }
      if (this.y + this.radius > canvasHeight) {
        this.y = canvasHeight - this.radius;
        this.angle = -this.angle;
      }
    }
  
    draw(canvasWidth) {

      // Set the shadow color, offset, and blur
      this.ctx.shadowColor = 'lightgray';
      this.ctx.shadowBlur = 25;

      // Calculate the distance between the ball and the center of the screen
      const distanceFromCenter = canvasWidth / 2 - Math.abs(this.x - canvasWidth / 2);

      // Calculate the offset of the shadow based on the distance from the center
      const shadowOffset = Math.max(10, (distanceFromCenter / 5));

      this.ctx.save()
      // Set the shadow offset based on the distance from the center
      this.ctx.shadowOffsetY = shadowOffset;

      // Draw the ball as a circle
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = "#fff";
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.restore();
    }

    serve(canvas) {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.angle = this.getRandomAngle();
    }

    getRandomAngle() {
      // Pick one of the provided allowed angle ranges
      const randomRangeIndex = Math.floor(Math.random() * this.angleRanges.length);
      // Get the min max from chosen range
      const [minAngle, maxAngle] = this.angleRanges[randomRangeIndex];
      // Calcuate an angle within the chosen range
      return Math.random() * (maxAngle - minAngle) + minAngle;
    }

    switchDirection() {
      this.angle = Math.PI - this.angle;
    }
  }