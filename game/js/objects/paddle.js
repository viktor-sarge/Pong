import Rectangle from '../../../engine/objects/rectangle.js';

/**
 * Paddle class representing a player-controlled paddle with movement, boost abilities,
 * and dynamic resizing. Extends the Rectangle base class.
 */
export default class Paddle extends Rectangle {
	/**
	 * Creates a new Paddle instance.
	 * @param {number} x - Initial X position
	 * @param {number} y - Initial Y position
	 * @param {number} width - Paddle width
	 * @param {number} height - Paddle height
	 * @param {string} color - Paddle color
	 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
	 * @param {string} id - Player identifier
	 * @param {HTMLCanvasElement} canvas - Canvas element
	 * @param {string} alignment - Paddle alignment ('left' or 'right')
	 * @param {number} edgePadding - Distance from canvas edge
	 * @param {AudioHandler} audio - Audio system reference
	 * @param {ParticleSystem} particles - Particle system reference
	 * @param {Object} config - Game configuration object
	 */
	constructor(
		x,
		y,
		width,
		height,
		color,
		ctx,
		id,
		canvas,
		alignment,
		edgePadding,
		audio,
		particles,
		config
	) {
		super(x, y, width, height);
		this.color = color;
		this.speed = config.PADDLE.BASE_SPEED;
		this.rescaleStep = config.PADDLE.RESCALE_STEP;
		this.minHeight = config.PADDLE.MIN_HEIGHT;
		this.ctx = ctx;
		this.originalHeight = height;
		this.originalX = x;
		this.originalY = y;
		this.id = id;
		this.canvas = canvas;
		this.alignment = alignment;
		this.edgePadding = edgePadding;
		this.boostOnCooldown = false;
		this.boostActive = false;
		this.boostReloadStart = null;
		this.boostReloadDuration = config.PADDLE.BOOST_COOLDOWN_MS;
		this.audio = audio;
		this.particles = particles;
		this.soundSwoosh = this.audio.registerSound(
			'game/audio/60013__qubodup__whoosh.flac'
		);
		this.config = config;
	}

	moveUp() {
		if (this.y - this.speed > 0) this.y -= this.speed;
	}

	moveDown() {
		if (this.y + this.height + this.speed < this.canvas.height)
			this.y += this.speed;
	}

	draw() {
		// Determine paddle color based on boost state
		let paddleColor;
		if (this.boostActive) {
			paddleColor = this.config.PADDLE.BOOST_ACTIVE_COLOR; // Red during boost
		} else if (this.boostOnCooldown) {
			paddleColor = this.config.PADDLE.COOLDOWN_COLOR; // Grey during cooldown
		} else {
			paddleColor = this.config.PADDLE.READY_COLOR; // White when ready
		}

		this.ctx.fillStyle = paddleColor;
		this.ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	shrink() {
		if (this.height > this.minHeight) {
			this.height = this.height - this.rescaleStep;
			this.y = this.y + this.rescaleStep / 2;
		}
	}

	grow() {
		if (this.height < this.originalHeight) {
			this.height = this.height + this.rescaleStep;
			this.y = this.y - this.rescaleStep / 2;
		}
	}

	reset() {
		switch (this.alignment) {
			case 'right':
				(this.x = this.canvas.width - this.width - this.edgePadding),
					(this.y = this.originalY);
				break;
			case 'left':
				this.x = this.originalX;
				this.y = this.originalY;
				break;
		}
		this.height = this.originalHeight;
		this.boostOnCooldown = false;
		this.boostActive = false;
		this.boostReloadStart = null;
	}

	realign(x) {
		this.x = x;
	}

	boost() {
		if (!this.boostOnCooldown) {
			this.audio.play(this.soundSwoosh);
			this.particles.addEmitter(
				this.x,
				this.y,
				this.config.PADDLE.BOOST_PARTICLE_SPEED,
				this.config.PADDLE.BOOST_PARTICLE_SPEED_VARIANCE,
				this.config.PADDLE.BOOST_PARTICLE_LIFESPAN,
				this.config.PADDLE.BOOST_PARTICLE_COLOR,
				this.config.PADDLE.BOOST_PARTICLE_COUNT
			);
			this.speed = this.config.PADDLE.BOOST_SPEED;
			this.boostActive = true; // Set boost as active (red)
			this.boostOnCooldown = true;

			setTimeout(() => {
				this.speed = this.config.PADDLE.BASE_SPEED;
				this.boostActive = false; // Boost ends, enter cooldown (grey)
			}, this.config.PADDLE.BOOST_DURATION_MS);

			setTimeout(() => {
				this.boostOnCooldown = false; // Cooldown ends, ready again (white)
				this.boostReloadStart = null;
			}, this.config.PADDLE.BOOST_COOLDOWN_MS);
		} else {
			// Failed boost click sound here?
		}
	}
}
