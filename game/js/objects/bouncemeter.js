export default class bouncemeter {
    constructor({bounces, radius, color}) {
        this.standardBouncesAmount = bounces;
        this.bounces = bounces;
        this.radius = radius;
        this.color = color;
    }

    draw(ctx, canvasCenterX, canvasCenterY) {

        ctx.fillStyle = this.color;
        for (let i = 0; i < this.bounces; i++) {
            const angle = i * (Math.PI * 2 / this.bounces);
            const x = canvasCenterX + this.radius * Math.cos(angle);
            const y = canvasCenterY + this.radius * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    remaining() {
        return this.bounces;
    }

    decrease() {
        this.bounces--;
    }

    reset() {
        this.bounces = this.standardBouncesAmount;
    }
}
