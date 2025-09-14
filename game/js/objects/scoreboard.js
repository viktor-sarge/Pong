/**
 * Scoreboard class that manages player scores, high scores, and win detection.
 * Handles score display, persistence, and winner determination.
 */
export default class Scoreboard {
	/**
	 * Creates a new Scoreboard instance.
	 * @param {Datastorage} storage - Data storage system for persistent high scores
	 * @param {Object} config - Game configuration object containing text settings
	 */
	constructor(storage, config) {
		this.scores = { p1: 0, p2: 0 };
		this.storage = storage;
		this.config = config;
	}

	draw(ctx, canvas) {
		ctx.fillStyle = this.config.TEXT_SETTINGS.SCOREBOARD.COLOR;
		ctx.font = this.config.TEXT_SETTINGS.SCOREBOARD.FONT;
		ctx.textAlign = this.config.TEXT_SETTINGS.SCOREBOARD.ALIGN;
		ctx.fillText(
			this.scores.p1,
			canvas.width / 4,
			this.config.TEXT_SETTINGS.SCOREBOARD.Y_POSITION
		);
		ctx.fillText(
			this.scores.p2,
			(canvas.width / 4) * 3,
			this.config.TEXT_SETTINGS.SCOREBOARD.Y_POSITION
		);
	}

	reset() {
		this.scores.p1 = 0;
		this.scores.p2 = 0;
	}

	score(playerKey) {
		this.scores[playerKey]++;
	}

	winner() {
		let data = {};
		let previousHighscore = this.storage.get('highscore');
		if (!previousHighscore) previousHighscore = 0;
		if (this.scores.p1 > this.scores.p2) {
			data['winner'] = 'p1';
			if (this.scores.p1 > previousHighscore) {
				data['newHighscore'] = true;
				this.storage.put('highscore', this.scores.p1);
			} else {
				data['newHighscore'] = false;
			}
			data['score'] = this.scores.p1;
		} else {
			data['winner'] = 'p2';
			if (this.scores.p2 > previousHighscore) {
				data['newHighscore'] = true;
				this.storage.put('highscore', this.scores.p2);
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
