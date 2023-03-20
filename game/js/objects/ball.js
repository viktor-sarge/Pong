import Circle from "../../../engine/objects/circle.js";

export default class Ball extends Circle {
    constructor(x, y, radius, speed, angleRanges, ctx, canvas, audioengine, physics, particles) {
      super(x,y, radius);
      this.speed = speed;
      this.originalSpeed = speed;
      this.angleRanges = angleRanges;
      this.angle = this.getRandomAngle();
      this.ctx = ctx;
      this.canvas = canvas;
      this.audio = audioengine;
      this.soundBounce = this.audio.registerSound('/game/audio/score.mp3');
      this.physics = physics;
      this.particles = particles;
    }

    update(canvasWidth, canvasHeight) {
      // Move the ball based on its speed and angle
      this.x += this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);
      this.speed = this.physics.applyFriction(this.speed);
  
      // Check if the ball collides with the canvas boundaries
      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.angle = Math.PI - this.angle;
        this.audio.play(this.soundBounce);
      }
      if (this.x + this.radius > canvasWidth) {
        this.x = canvasWidth - this.radius;
        this.angle = Math.PI - this.angle;
        this.audio.play(this.soundBounce);
      }
      if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.angle = -this.angle;
        this.audio.play(this.soundBounce);
      }
      if (this.y + this.radius > canvasHeight) {
        this.y = canvasHeight - this.radius;
        this.angle = -this.angle;
        this.audio.play(this.soundBounce);
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

    playBounce() {
      // Restarts the sound. Useful when playing longer/louder bounce sounds
      if(this.audio.playing(this.soundBounce)) {
        this.audio.stop(this.soundBounce); 
        this.audio.play(this.soundBounce);
      } else {
        this.audio.play(this.soundBounce);
      }
    }
    
    accelerate() {
      this.speed = this.originalSpeed;
    }

    serve() {
      this.x = this.canvas.width / 2;
      this.y = this.canvas.height / 2;
      this.speed = this.originalSpeed;
      this.angle = this.getRandomAngle();
      this.particles.addEmitter(this.x, this.y, 250, 200, 0.3, "gray", 5);
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

    getSpeed() {
      return this.speed;
    }

    getSide() {
      return this.x < this.canvas.width / 2 ? "left" : "right";
    }
  }

//TODO: Use new audio engine abstraction