export default class Net {
    constructor(color, ctx) {
        this.color = color;
        this.ctx = ctx;
    }
    draw(canvasWidth, canvasHeight) {
        // Draw the net
        this.ctx.setLineDash([5, 5]); // dotted
        this.ctx.beginPath();
        this.ctx.moveTo(canvasWidth / 2, 0);
        this.ctx.lineTo(canvasWidth / 2, canvasHeight);
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
    }
}