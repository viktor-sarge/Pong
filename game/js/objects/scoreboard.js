export default class scoreboard {
    constructor(storage) {
        this.scores = {p1:0, p2: 0};
        this.storage = storage;
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
        debugger;
        let data = {};
        let previousHighscore = this.storage.get("highscore");
        if (!previousHighscore) previousHighscore = 0;
        if(this.scores.p1 > this.scores.p2) { 
            data['winner'] = 'p1';
            if (this.scores.p1 > previousHighscore) {
                data['newHighscore'] = true;
                this.storage.put("highscore", this.scores.p1);
            } else {
                data['newHighscore'] = false;
            } 
            data['score'] = this.scores.p1;
        }
        else {
            data['winner'] = 'p2';
            if (this.scores.p2 > previousHighscore) {
                data['newHighscore'] = true;
                this.storage.put("highscore", this.scores.p2);
            } else {
                data['newHighscore'] = false;
            } 
            data['score'] = this.scores.p2;
        }
        console.log(data);
        return data;
    }

    doublePoints(key) {
        this.scores[key] = this.scores[key] * 2;
    }
}
