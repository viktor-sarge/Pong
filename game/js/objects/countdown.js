export default class CountdownHandler {
    constructor(CONF, ctx, canvas, resetGame) {
        this.CONF = CONF;
        this.ctx = ctx;
        this.canvas = canvas;
        this.resetGame = resetGame;
        this.countdown = CONF.GAME.COUNTDOWN.NR_OF_STEPS
        this.beep = new Howl({
            src: ['/game/audio/555061__magnuswaker__repeatable-beep.wav']
        });
        this.startsound = new Howl({
            src: ['/game/audio/641042__magnuswaker__racing-buzzer.wav']
        });
    }
    start() {
        // Immediately display the first number of the countdown
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.CONF.GAME.BASE_COLOR;
        this.ctx.font = '96px Vermin';
        this.ctx.fillText(this.countdown, this.canvas.width / 2, this.canvas.height / 2);
        this.countdown--;
        this.beep.play();

        // Start countdown
        let timerIntervalId = setInterval(() => {
            if (this.countdown > 0) {
            // clear the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
            // write the countdown on the canvas
            this.ctx.fillStyle = this.CONF.GAME.BASE_COLOR;
            this.ctx.font = '96px Vermin';
            this.ctx.fillText(this.countdown, this.canvas.width / 2, this.canvas.height / 2);
    
            this.countdown--;
            this.beep.play();
            } else {
            // clear the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.resetGame()
    
            // stop the timer
            clearInterval(timerIntervalId);
            this.startsound.play();
            this.countdown = this.CONF.GAME.COUNTDOWN.NR_OF_STEPS;
            }
        }, this.CONF.GAME.COUNTDOWN.STEP_DELAY_IN_MS);
    }
}