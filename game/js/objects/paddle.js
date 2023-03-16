import Rectangle from "../../../engine/objects/rectangle.js";
export default class Paddle extends Rectangle {
    constructor(x, y, width, height, color, ctx, id, canvas, alignment, edgePadding) {
      super(x, y, width, height);
      this.color = color;
      this.speed = 7;
      this.rescaleStep = 10;
      this.minHeight = 40;
      this.ctx = ctx
      this.originalHeight = height;
      this.originalX = x;
      this.originalY = y;
      this.id = id;
      this.canvas = canvas;
      this.alignment = alignment;
      this.edgePadding = edgePadding;
      this.boostOnCooldown = false;
      this.boostReloadStart = null;
      this.boostReloadDuration = 3000; // milliseconds
      this.boostReloadRadius = 7; // pixels
      this.boostReloadColor = "black";
    }
  
    moveUp() {
      if(this.y - this.speed > 0) this.y -= this.speed;
    }
  
    moveDown() {
        if(this.y + this.height + this.speed < this.canvas.height) this.y += this.speed;
    }
  
    draw() {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
      this.drawBoostReload(this.ctx);
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

    shrink() {
      if(this.height > this.minHeight) { 
        this.height = this.height - this.rescaleStep;
        this.y = this.y + this.rescaleStep / 2;
      }
    }

    grow() {
      if(this.height < this.originalHeight) {
        this.height = this.height + this.rescaleStep;
        this.y = this.y - this.rescaleStep / 2;
      }
    }

    reset() {
      switch(this.alignment) {
        case "right":
          this.x = this.canvas.width-this.width-this.edgePadding,
          this.y = this.originalY
          break;
        case "left":
          this.x = this.originalX;
          this.y = this.originalY
          break;
      } 
      this.height = this.originalHeight;
    }

    realign(x) {
      this.x = x;
    }

    boost() {
      if (!this.boostOnCooldown) {
        // TODO: Play boost swoosh sound? 
        this.speed = 20;
        this.boostOnCooldown = true;
        setTimeout(() => {
          this.speed = 7;
        }, 300);
        setTimeout(() => {
          this.boostOnCooldown = false;
          this.boostReloadStart = null
        }, 3000);
      } else {
        // Failed boost click sound here? 
      }
    }

    drawBoostReload() {
      if (this.boostOnCooldown) {
        if (this.boostReloadStart === null) {
          this.boostReloadStart = Date.now();
        }
        const elapsedTime = Date.now() - this.boostReloadStart;
        const progress = Math.min(elapsedTime / this.boostReloadDuration, 1);
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = this.boostReloadRadius - this.boostReloadRadius * progress;
        
        this.ctx.save();
        this.ctx.strokeStyle = this.boostReloadColor;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.restore();
      }
    }

  }