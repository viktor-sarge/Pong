export default class Net {
    constructor(color) {
        this.color = color;
    }
    draw(ctx, canvas) {
        // Draw the net
        ctx.setLineDash([5, 5]); // dotted
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
}