export default class InputHandler {
	constructor(gameState) {
		this.keys = {};
		this.gameState = gameState;
		this.bindings = null;
		this.gamepads = null;
		this.stickY = 0;
		this.eventListeners = [];

		// Bind methods to preserve context
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);

		this.setupEventListeners();
	}

	/**
	 * Set up keyboard event listeners with error handling
	 */
	setupEventListeners() {
		try {
			document.addEventListener('keydown', this.handleKeyDown);
			document.addEventListener('keyup', this.handleKeyUp);

			// Store references for cleanup
			this.eventListeners.push(
				{ type: 'keydown', handler: this.handleKeyDown },
				{ type: 'keyup', handler: this.handleKeyUp }
			);
		} catch (error) {
			console.error('Failed to set up input event listeners:', error);
		}
	}

	/**
	 * Handle keydown events with error handling
	 * @param {KeyboardEvent} event - The keyboard event
	 */
	handleKeyDown(event) {
		try {
			if (event.code === 'KeyP') {
				this.gameState.paused = !this.gameState.paused;
			} else {
				this.keys[event.code] = true;
			}
		} catch (error) {
			console.error('Error handling keydown event:', error);
		}
	}

	/**
	 * Handle keyup events with error handling
	 * @param {KeyboardEvent} event - The keyboard event
	 */
	handleKeyUp(event) {
		try {
			this.keys[event.code] = false;
		} catch (error) {
			console.error('Error handling keyup event:', error);
		}
	}

	/**
	 * Set up input bindings with validation
	 * @param {Array} bindings - Array of input binding configurations
	 */
	setup(bindings) {
		if (!Array.isArray(bindings)) {
			console.error('Input bindings must be an array');
			return;
		}

		// Validate bindings structure
		const validBindings = bindings.filter((binding) => {
			if (!binding || typeof binding !== 'object') {
				console.warn('Invalid binding object:', binding);
				return false;
			}

			if (!binding.func || typeof binding.func !== 'object') {
				console.warn('Binding must have a func object:', binding);
				return false;
			}

			if (!binding.bindings || typeof binding.bindings !== 'object') {
				console.warn('Binding must have a bindings object:', binding);
				return false;
			}

			return true;
		});

		this.bindings = validBindings;
	}

	/**
	 * Update input state with error handling
	 */
	update() {
		if (!this.bindings) {
			return;
		}

		try {
			// Update gamepad state
			this.updateGamepadState();

			// Process each binding group
			this.bindings.forEach((group) => {
				try {
					this.processKeyboardInput(group);
					this.processGamepadInput(group);
				} catch (error) {
					console.error('Error processing input group:', error);
				}
			});
		} catch (error) {
			console.error('Error in input update:', error);
		}
	}

	/**
	 * Update gamepad state safely
	 */
	updateGamepadState() {
		try {
			if (navigator.getGamepads) {
				this.gamepads = navigator.getGamepads();
			}
		} catch (error) {
			console.warn('Failed to get gamepads:', error);
			this.gamepads = null;
		}
	}

	/**
	 * Process keyboard input for a binding group
	 * @param {Object} group - The input binding group
	 */
	processKeyboardInput(group) {
		if (
			!group.bindings.keyboard ||
			!Array.isArray(group.bindings.keyboard)
		) {
			return;
		}

		group.bindings.keyboard.forEach((binding) => {
			try {
				if (binding.key && binding.action && this.keys[binding.key]) {
					if (typeof group.func[binding.action] === 'function') {
						group.func[binding.action]();
					}
				}
			} catch (error) {
				console.error('Error processing keyboard binding:', error);
			}
		});
	}

	/**
	 * Process gamepad input for a binding group
	 * @param {Object} group - The input binding group
	 */
	processGamepadInput(group) {
		if (!this.gamepads || !group.bindings.gamepad) {
			return;
		}

		const gamepadID = group.gamepadID || 0;
		const gamepad = this.gamepads[gamepadID];

		if (!gamepad || !gamepad.connected) {
			return;
		}

		try {
			// Process button mappings
			if (group.bindings.gamepad.buttons) {
				Object.entries(group.bindings.gamepad.buttons).forEach(
					([button, action]) => {
						try {
							const buttonIndex = parseInt(button);
							if (
								gamepad.buttons[buttonIndex] &&
								gamepad.buttons[buttonIndex].pressed
							) {
								if (typeof group.func[action] === 'function') {
									group.func[action]();
								}
							}
						} catch (error) {
							console.error(
								'Error processing gamepad button:',
								error
							);
						}
					}
				);
			}

			// Process analog stick
			this.processAnalogStick(group, gamepad);
		} catch (error) {
			console.error('Error processing gamepad input:', error);
		}
	}

	/**
	 * Process analog stick input
	 * @param {Object} group - The input binding group
	 * @param {Gamepad} gamepad - The gamepad object
	 */
	processAnalogStick(group, gamepad) {
		try {
			if (!gamepad.axes || gamepad.axes.length < 2) {
				return;
			}

			this.stickY = gamepad.axes[1];
			const threshold = group.gamepadInputThreshold || 0.5;

			if (this.stickY < -threshold) {
				const action = group.bindings.gamepad.leftStickUp;
				if (action && typeof group.func[action] === 'function') {
					group.func[action]();
				}
			} else if (this.stickY > threshold) {
				const action = group.bindings.gamepad.leftStickDown;
				if (action && typeof group.func[action] === 'function') {
					group.func[action]();
				}
			}
		} catch (error) {
			console.error('Error processing analog stick:', error);
		}
	}

	/**
	 * Clean up event listeners to prevent memory leaks
	 */
	destroy() {
		try {
			this.eventListeners.forEach(({ type, handler }) => {
				document.removeEventListener(type, handler);
			});
			this.eventListeners = [];
			this.keys = {};
			this.bindings = null;
		} catch (error) {
			console.error('Error cleaning up input handler:', error);
		}
	}
}
