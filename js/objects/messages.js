export default class messages {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
    }
    write(settings, message) {
        this.ctx.fillStyle = settings.COLOR;
        this.ctx.font = settings.FONT;
        this.ctx.textAlign = settings.ALIGN;
        this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
    }
}