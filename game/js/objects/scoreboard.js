export default class scoreboard {
    constructor() {
        this.scores = {p1:0, p2: 0}
    }

    draw(ctx, canvas) {
        ctx.fillStyle = "white";
        ctx.font = "48px Vermin";
        ctx.textAlign = "center";
        ctx.fillText(this.scores.p1, canvas.width / 4, 60);
        ctx.fillText(this.scores.p2, (canvas.width / 4) * 3, 60);
    }

    reset() {
        this.scores.p1 = 0;
        this.scores.p2 = 0;
    }

    score(playerKey) {
        this.scores[playerKey]++
    }

    winner() {
        if(this.scores.p1 > this.scores.p2) { return 'p1' }
        else {return 'p2'}
    }

    doublePoints(key) {
        this.scores[key] = this.scores[key] * 2;
    }
}
