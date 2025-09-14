export default class CountdownHandler {
	constructor(CONF, ctx, canvas, resetGame, audioplayer, messageHandler) {
		this.CONF = CONF;
		this.ctx = ctx;
		this.canvas = canvas;
		this.resetGame = resetGame;
		this.countdown = CONF.GAME.COUNTDOWN.NR_OF_STEPS;
		this.audio = audioplayer;
		this.messaging = messageHandler;
		this.timerIntervalId = null;
		this.isRunning = false;

		// Register sounds with error handling
		try {
			this.beep = this.audio.registerSound(
				'/game/audio/555061__magnuswaker__repeatable-beep.wav'
			);
			this.startsound = this.audio.registerSound(
				'/game/audio/641042__magnuswaker__racing-buzzer.wav'
			);
		} catch (error) {
			console.error('Error registering countdown sounds:', error);
			this.beep = null;
			this.startsound = null;
		}
	}

	/**
	 * Start the countdown with proper cleanup and error handling
	 */
	start() {
		try {
			// Clear any existing timer to prevent multiple timers
			this.stop();

			this.isRunning = true;
			this.countdown = this.CONF.GAME.COUNTDOWN.NR_OF_STEPS;

			// Immediately display the first number of the countdown
			this.clearAndDisplay(this.countdown);
			this.countdown--;
			this.playBeep();

			// Start countdown timer
			this.timerIntervalId = setInterval(() => {
				try {
					if (!this.isRunning) {
						this.stop();
						return;
					}

					if (this.countdown > 0) {
						this.clearAndDisplay(this.countdown);
						this.countdown--;
						this.playBeep();
					} else {
						this.finishCountdown();
					}
				} catch (error) {
					console.error('Error in countdown timer:', error);
					this.stop();
				}
			}, this.CONF.GAME.COUNTDOWN.STEP_DELAY_IN_MS);
		} catch (error) {
			console.error('Error starting countdown:', error);
			this.stop();
		}
	}

	/**
	 * Clear canvas and display countdown number
	 * @param {number} number - Number to display
	 */
	clearAndDisplay(number) {
		try {
			if (this.ctx && this.canvas) {
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

				if (this.messaging) {
					this.messaging.write(
						this.CONF.TEXT_SETTINGS.BIG,
						number,
						this.ctx,
						this.canvas
					);
				}
			}
		} catch (error) {
			console.error('Error clearing and displaying countdown:', error);
		}
	}

	/**
	 * Play beep sound with error handling
	 */
	playBeep() {
		try {
			if (this.audio && this.beep !== null) {
				this.audio.play(this.beep);
			}
		} catch (error) {
			console.error('Error playing beep sound:', error);
		}
	}

	/**
	 * Play start sound with error handling
	 */
	playStartSound() {
		try {
			if (this.audio && this.startsound !== null) {
				this.audio.play(this.startsound);
			}
		} catch (error) {
			console.error('Error playing start sound:', error);
		}
	}

	/**
	 * Finish the countdown and start the game
	 */
	finishCountdown() {
		try {
			// Clear the canvas
			if (this.ctx && this.canvas) {
				this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			}

			// Reset the game
			if (this.resetGame && typeof this.resetGame === 'function') {
				this.resetGame();
			}

			// Stop the timer and play start sound
			this.stop();
			this.playStartSound();

			// Reset countdown for next time
			this.countdown = this.CONF.GAME.COUNTDOWN.NR_OF_STEPS;
		} catch (error) {
			console.error('Error finishing countdown:', error);
			this.stop();
		}
	}

	/**
	 * Stop the countdown timer and clean up
	 */
	stop() {
		try {
			this.isRunning = false;

			if (this.timerIntervalId !== null) {
				clearInterval(this.timerIntervalId);
				this.timerIntervalId = null;
			}
		} catch (error) {
			console.error('Error stopping countdown:', error);
		}
	}

	/**
	 * Check if countdown is currently running
	 * @returns {boolean} True if countdown is running
	 */
	isActive() {
		return this.isRunning;
	}

	/**
	 * Clean up resources
	 */
	destroy() {
		this.stop();
		this.ctx = null;
		this.canvas = null;
		this.resetGame = null;
		this.audio = null;
		this.messaging = null;
	}
}

// TODO: Use new audio engine abstraction
