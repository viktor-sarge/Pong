export default class CountdownHandler {
    constructor(CONF, ctx, canvas, resetGame, audioplayer, messageHandler) {
        this.CONF = CONF;
        this.ctx = ctx;
        this.canvas = canvas;
        this.resetGame = resetGame;
        this.countdown = CONF.GAME.COUNTDOWN.NR_OF_STEPS
        this.audio = audioplayer;
        this.messaging = messageHandler;
        this.beep = this.audio.registerSound('/game/audio/555061__magnuswaker__repeatable-beep.wav');
        this.startsound = this.audio.registerSound('/game/audio/641042__magnuswaker__racing-buzzer.wav');
    }
    start() {
        // Immediately display the first number of the countdown
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.messaging.write(this.CONF.TEXT_SETTINGS.BIG, this.countdown, this.ctx, this.canvas)
        this.countdown--;
        this.audio.play(this.beep);

        // Start countdown
        let timerIntervalId = setInterval(() => {
            if (this.countdown > 0) {
            // clear the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
            // write the countdown on the canvas
            this.messaging.write(this.CONF.TEXT_SETTINGS.BIG, this.countdown, this.ctx, this.canvas)
    
            this.countdown--;
            this.audio.play(this.beep);
            } else {
            // clear the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.resetGame()
    
            // stop the timer
            clearInterval(timerIntervalId);
            this.audio.play(this.startsound);
            this.countdown = this.CONF.GAME.COUNTDOWN.NR_OF_STEPS;
            }
        }, this.CONF.GAME.COUNTDOWN.STEP_DELAY_IN_MS);
    }
}

// TODO: Use new audio engine abstraction