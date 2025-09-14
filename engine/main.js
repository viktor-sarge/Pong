import Messages from './messages.js';
import AudioHandler from './audio.js';
import GUI from './gui.js';
import InputHandler from './inputHandler.js';
import Collisions from './collisions.js';
import Physics from './physics.js';
import ParticleSystem from './particles/particles.js';
import Datastorage from './storage/datastorage.js';

/**
 * Main game engine class that orchestrates all subsystems and manages the game loop.
 * Provides a complete framework for 2D canvas-based games with input handling,
 * audio, physics, particles, and persistent storage.
 */
export default class GameEngine {
	/**
	 * Creates a new GameEngine instance with all required subsystems.
	 * @param {Object} CONF - Game configuration object containing settings
	 * @param {Object} TEXTS - Text/string resources for the game
	 */
	constructor(CONF, TEXTS) {
		/**
		 * Current state of the game
		 * @type {Object}
		 */
		this.gamestate = {
			multiplayer: false,
			paused: false,
			gameOver: false,
			running: false,
			error: false,
		};

		try {
			this.messages = new Messages();
			this.audio = new AudioHandler();
			this.gui = new GUI(this.gamestate);
			this.canvasVars = this.gui.getCanvasVars();
			this.input = new InputHandler(this.gamestate);
			this.collisions = new Collisions();
			this.physics = new Physics(CONF.PHYSICS.FRICTION);
			this.particles = new ParticleSystem(this.canvasVars.ctx);
			this.storage = new Datastorage();

			this.gameUpdateFunction = null;
			this.gameDrawFunction = null;
			this.gameOverFunction = null;
			this.CONF = CONF;
			this.TEXTS = TEXTS;
			this.lastFrameTime = 0;
			this.deltaTime = 0;
			this.errorCount = 0;
			this.maxErrors = 10; // Stop the game after too many consecutive errors

			this.gameLoop = this.createGameLoop();
		} catch (error) {
			console.error('Failed to initialize GameEngine:', error);
			this.gamestate.error = true;
			throw error;
		}
	}

	/**
	 * Create the main game loop with error handling
	 * @returns {Function} The game loop function
	 */
	createGameLoop() {
		return (timestamp) => {
			try {
				// Reset error count on successful frame
				this.errorCount = 0;

				this.deltaTime = (timestamp - this.lastFrameTime) / 1000;
				this.lastFrameTime = timestamp;

				if (this.gamestate.error) {
					this.displayError();
				} else if (this.gamestate.gameOver) {
					if (this.gamestate.running) {
						this.safeExecute(
							() => this.gameOverFunction(),
							'gameOverFunction'
						);
						this.gui.showRestart();
					}
				} else if (this.gamestate.paused) {
					this.safeExecute(() => this.draw(), 'draw (paused)');
					this.messages.write(
						this.CONF.TEXT_SETTINGS.BIG,
						this.TEXTS.STATES.PAUSED,
						this.canvasVars.ctx,
						this.canvasVars.canvas
					);
				} else if (this.gamestate.running) {
					this.safeExecute(() => this.update(), 'update');
					this.safeExecute(() => this.draw(), 'draw');
				}
			} catch (error) {
				this.handleGameLoopError(error);
			}

			if (!this.gamestate.error) {
				requestAnimationFrame(this.gameLoop);
			}
		};
	}

	/**
	 * Safely execute a function with error handling
	 * @param {Function} func - Function to execute
	 * @param {string} name - Name of the function for error reporting
	 */
	safeExecute(func, name) {
		try {
			func();
		} catch (error) {
			console.error(`Error in ${name}:`, error);
			this.errorCount++;

			if (this.errorCount >= this.maxErrors) {
				console.error('Too many errors, stopping game loop');
				this.gamestate.error = true;
			}
		}
	}

	/**
	 * Handle critical game loop errors
	 * @param {Error} error - The error that occurred
	 */
	handleGameLoopError(error) {
		console.error('Critical game loop error:', error);
		this.gamestate.error = true;
		this.gamestate.running = false;
	}

	/**
	 * Display error message to user
	 */
	displayError() {
		try {
			this.canvasVars.ctx.clearRect(
				0,
				0,
				this.canvasVars.canvasWidth,
				this.canvasVars.canvasHeight
			);
			this.messages.write(
				this.CONF.TEXT_SETTINGS.BIG,
				'Game Error - Please Refresh',
				this.canvasVars.ctx,
				this.canvasVars.canvas
			);
		} catch (error) {
			console.error('Failed to display error message:', error);
		}
	}

	/**
	 * Registers the game over function to be called when the game ends.
	 * @param {Function} gameOver - Function to execute when game over state is reached
	 */
	registerGameOverFunction(gameOver) {
		if (typeof gameOver !== 'function') {
			console.warn('gameOverFunction must be a function');
			return;
		}
		this.gameOverFunction = gameOver;
	}

	/**
	 * Registers the main game update logic function.
	 * @param {Function} update - Function containing game logic that runs each frame
	 */
	registerUpdateLogic(update) {
		if (typeof update !== 'function') {
			console.warn('updateFunction must be a function');
			return;
		}
		this.gameUpdateFunction = update;
	}

	/**
	 * Registers the main game draw function for rendering.
	 * @param {Function} draw - Function containing rendering logic that runs each frame
	 */
	registerDrawLogic(draw) {
		if (typeof draw !== 'function') {
			console.warn('drawFunction must be a function');
			return;
		}
		this.gameDrawFunction = draw;
	}

	/**
	 * Starts the game engine and begins the main game loop.
	 * @throws {Error} If the engine failed to initialize properly
	 */
	start() {
		if (this.gamestate.error) {
			console.error('Cannot start game due to initialization errors');
			return;
		}

		try {
			requestAnimationFrame(this.gameLoop);
		} catch (error) {
			console.error('Failed to start game loop:', error);
			this.gamestate.error = true;
		}
	}

	update() {
		if (this.particles) {
			this.particles.update(this.deltaTime);
		}

		if (this.gameUpdateFunction) {
			this.gameUpdateFunction();
		}
	}

	draw() {
		if (this.canvasVars?.ctx) {
			this.canvasVars.ctx.clearRect(
				0,
				0,
				this.canvasVars.canvasWidth,
				this.canvasVars.canvasHeight
			);
		}

		if (this.particles) {
			this.particles.render();
		}

		if (this.gameDrawFunction) {
			this.gameDrawFunction();
		}
	}
}
