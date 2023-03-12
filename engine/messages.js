export default class Messages {
    write(settings, message, ctx, canvas, x, y) {
        ctx.fillStyle = settings.COLOR;
        ctx.font = settings.FONT;
        ctx.textAlign = settings.ALIGN;
        if(x && y) {
            ctx.fillText(message, x, y);
        } else {
            ctx.fillText(message, canvas.width / 2, canvas.height / 2);
        }
    }
}

