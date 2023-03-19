export default class Particle {
    constructor(x, y, velocityX, velocityY, accelerationX, accelerationY, color, lifespan) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.accelerationX = accelerationX;
        this.accelerationY = accelerationY;
        this.color = color;
        this.lifespan = lifespan;
        this.age = 0;
    }

    update(deltaTime) {
        this.velocityX += this.accelerationX * deltaTime;
        this.velocityY += this.accelerationY * deltaTime;
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        this.age += deltaTime;
    }

    isDead() {
        return this.age >= this.lifespan;
    }
}