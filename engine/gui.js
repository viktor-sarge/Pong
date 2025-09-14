export default class GUI {
	constructor(gamestate) {
		this.gamestate = gamestate;
		this.windowResizeFunction = null;
		this.eventListeners = [];
		this.canvasVars = null;

		try {
			this.initializeCanvas();
			this.setupWindowResize();
		} catch (error) {
			console.error('Failed to initialize GUI:', error);
			throw error;
		}
	}

	/**
	 * Initialize canvas and context with error handling
	 */
	initializeCanvas() {
		try {
			const canvas = document.getElementById('myCanvas');
			if (!canvas) {
				throw new Error('Canvas element with id "myCanvas" not found');
			}

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				throw new Error('Failed to get 2D rendering context');
			}

			this.canvasVars = { canvas, ctx };

			// Make canvas fullscreen
			this.updateCanvasSize();
		} catch (error) {
			console.error('Error initializing canvas:', error);
			throw error;
		}
	}

	/**
	 * Update canvas size and related variables
	 */
	updateCanvasSize() {
		try {
			if (!this.canvasVars) {
				return;
			}

			this.canvasVars.canvas.width = window.innerWidth;
			this.canvasVars.canvas.height = window.innerHeight;

			// Update canvas variables
			this.canvasVars.canvasWidth = this.canvasVars.canvas.width;
			this.canvasVars.canvasHeight = this.canvasVars.canvas.height;
			this.canvasVars.canvasCenterX = this.canvasVars.canvasWidth / 2;
			this.canvasVars.canvasCenterY = this.canvasVars.canvasHeight / 2;
		} catch (error) {
			console.error('Error updating canvas size:', error);
		}
	}

	/**
	 * Set up window resize handling
	 */
	setupWindowResize() {
		try {
			const resizeHandler = () => {
				try {
					this.updateCanvasSize();
					if (
						this.windowResizeFunction &&
						typeof this.windowResizeFunction === 'function'
					) {
						this.windowResizeFunction();
					}
				} catch (error) {
					console.error('Error in resize handler:', error);
				}
			};

			window.addEventListener('resize', resizeHandler);
			this.eventListeners.push({
				type: 'resize',
				handler: resizeHandler,
				target: window,
			});
		} catch (error) {
			console.error('Error setting up window resize handler:', error);
		}
	}

	/**
	 * Initialize UI elements and event handlers
	 * @param {Object} countdown - Countdown handler object
	 */
	init(countdown) {
		try {
			this.countdown = countdown;

			// Get UI elements with error checking
			this.startbutton2player = this.getElement('startbutton2player');
			this.restartButton = this.getElement('restartButton');
			this.startscreen = this.getElement('startscreen');
			this.startbutton = this.getElement('startbutton');

			this.setupEventHandlers();
		} catch (error) {
			console.error('Error initializing GUI:', error);
		}
	}

	/**
	 * Safely get DOM element by ID
	 * @param {string} id - Element ID
	 * @returns {Element|null} The element or null if not found
	 */
	getElement(id) {
		try {
			const element = document.getElementById(id);
			if (!element) {
				console.warn(`Element with id "${id}" not found`);
			}
			return element;
		} catch (error) {
			console.error(`Error getting element ${id}:`, error);
			return null;
		}
	}

	/**
	 * Set up event handlers for UI elements
	 */
	setupEventHandlers() {
		try {
			// Singleplayer game start event listener
			if (this.startbutton) {
				const singlePlayerHandler = () => {
					try {
						if (this.startscreen) {
							this.startscreen.classList.toggle('hidden');
						}
						if (this.countdown) {
							this.countdown.start();
						}
					} catch (error) {
						console.error(
							'Error in single player start handler:',
							error
						);
					}
				};

				this.startbutton.addEventListener('click', singlePlayerHandler);
				this.eventListeners.push({
					type: 'click',
					handler: singlePlayerHandler,
					target: this.startbutton,
				});
			}

			// Multiplayer game start event listener
			if (this.startbutton2player) {
				const multiPlayerHandler = () => {
					try {
						if (this.startscreen) {
							this.startscreen.classList.toggle('hidden');
						}
						this.gamestate.multiplayer = true;
						if (this.countdown) {
							this.countdown.start();
						}
					} catch (error) {
						console.error(
							'Error in multiplayer start handler:',
							error
						);
					}
				};

				this.startbutton2player.addEventListener(
					'click',
					multiPlayerHandler
				);
				this.eventListeners.push({
					type: 'click',
					handler: multiPlayerHandler,
					target: this.startbutton2player,
				});
			}

			// Restart event listener
			if (this.restartButton) {
				const restartHandler = () => {
					try {
						this.restartButton.style.display = 'none';
						if (this.countdown) {
							this.countdown.start();
						}
					} catch (error) {
						console.error('Error in restart handler:', error);
					}
				};

				this.restartButton.addEventListener('click', restartHandler);
				this.eventListeners.push({
					type: 'click',
					handler: restartHandler,
					target: this.restartButton,
				});
			}
		} catch (error) {
			console.error('Error setting up event handlers:', error);
		}
	}

	/**
	 * Register window resize function with validation
	 * @param {Function} resizeFunction - Function to call on window resize
	 */
	registerWindowResizeFunction(resizeFunction) {
		if (typeof resizeFunction !== 'function') {
			console.warn('Window resize function must be a function');
			return;
		}
		this.windowResizeFunction = resizeFunction;
	}

	/**
	 * Show restart button with error handling
	 */
	showRestart() {
		try {
			if (this.restartButton) {
				this.restartButton.style.display = 'block';
			}
		} catch (error) {
			console.error('Error showing restart button:', error);
		}
	}

	/**
	 * Get current canvas (deprecated method for compatibility)
	 * @returns {HTMLCanvasElement|null} The canvas element
	 */
	getCurrentCanvas() {
		return this.canvasVars?.canvas || null;
	}

	/**
	 * Get current context (deprecated method for compatibility)
	 * @returns {CanvasRenderingContext2D|null} The canvas context
	 */
	getCurrentCtx() {
		return this.canvasVars?.ctx || null;
	}

	/**
	 * Get canvas variables object
	 * @returns {Object|null} Canvas variables or null if not initialized
	 */
	getCanvasVars() {
		return this.canvasVars;
	}

	/**
	 * Create page (TODO: implement for multi-page support)
	 */
	createPage() {
		// TODO: Create canvas or full screen divs
		// return index
		console.warn('createPage not yet implemented');
	}

	/**
	 * Set active page (TODO: implement for multi-page support)
	 * @param {number} index - Page index
	 */
	setActivePage(index) {
		// TODO: Set visibility of specific pages/canvases
		console.warn('setActivePage not yet implemented');
	}

	/**
	 * Clean up event listeners and resources
	 */
	destroy() {
		try {
			this.eventListeners.forEach(({ type, handler, target }) => {
				if (
					target &&
					typeof target.removeEventListener === 'function'
				) {
					target.removeEventListener(type, handler);
				}
			});
			this.eventListeners = [];
		} catch (error) {
			console.error('Error cleaning up GUI:', error);
		}
	}
}

// TODO: This should be refactored to be general purpose
// * Set up any number of screens / canvases based in config
// * Have a method to show screens by ref and hide others.
