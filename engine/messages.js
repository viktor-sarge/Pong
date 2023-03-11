export default class Messages {
    write(settings, message, ctx, canvas) {
        ctx.fillStyle = settings.COLOR;
        ctx.font = settings.FONT;
        ctx.textAlign = settings.ALIGN;
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    }
}

// TODO: Should be able to write at any position
