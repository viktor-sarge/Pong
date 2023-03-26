export default class bouncemeter {
    constructor({bounces, radius, color, canvas}) {
        this.standardBouncesAmount = bounces;
        this.bounces = bounces;
        this.radius = radius;
        this.color = color;
        this.canvas = canvas;
        this.startX = this.canvas.width/8 * 3;
        this.startY = 50;
        this.spacing = (this.canvas.width/4) / bounces;
    }

    draw(ctx) {

        let x = this.startX;
        for (let i = 0; i < this.standardBouncesAmount; i++) {
            if(i < this.bounces) {
                ctx.fillStyle = this.color;
            } else {
                ctx.fillStyle = "lightgray";
            }
            ctx.beginPath();
            ctx.arc(x, this.startY, 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            x = x + this.spacing;
        }
    }

    reposition() {
        this.startX = this.canvas.width/8 * 3;
        this.spacing = (this.canvas.width/4) / this.standardBouncesAmount;
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
