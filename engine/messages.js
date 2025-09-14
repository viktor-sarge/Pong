/**
 * Messages class for displaying text with dynamic font sizing to fit the screen.
 */
export default class Messages {
	/**
	 * Writes a message to the canvas with dynamic font sizing.
	 * @param {Object} settings - Text settings (COLOR, FONT, ALIGN)
	 * @param {string} message - The message to display
	 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
	 * @param {HTMLCanvasElement} canvas - Canvas element
	 * @param {number} x - Optional X position
	 * @param {number} y - Optional Y position
	 */
	write(settings, message, ctx, canvas, x, y) {
		ctx.fillStyle = settings.COLOR;
		ctx.textAlign = settings.ALIGN;

		// Calculate appropriate font size based on canvas width and message length
		const fontSize = this.calculateFontSize(
			message,
			canvas.width,
			settings.FONT
		);
		const fontFamily = this.extractFontFamily(settings.FONT);
		ctx.font = `${fontSize}px ${fontFamily}`;

		if (x && y) {
			ctx.fillText(message, x, y);
		} else {
			ctx.fillText(message, canvas.width / 2, canvas.height / 2);
		}
	}

	/**
	 * Calculates appropriate font size based on message length and canvas width.
	 * @param {string} message - The message to display
	 * @param {number} canvasWidth - Width of the canvas
	 * @param {string} originalFont - Original font setting (e.g., "96px Vermin")
	 * @returns {number} Calculated font size in pixels
	 */
	calculateFontSize(message, canvasWidth, originalFont) {
		// Extract original font size as baseline
		const originalSize = parseInt(
			originalFont.match(/(\d+)px/)?.[1] || '96'
		);

		// For very short text (like countdown numbers), use a larger scale
		if (message.toString().length <= 2) {
			// Scale short messages to be prominent on screen
			const smallScale = Math.min(canvasWidth / 8, originalSize * 2);
			return Math.floor(smallScale);
		}

		// Calculate target width (80% of canvas width for padding)
		const targetWidth = canvasWidth * 0.8;

		// Estimate character width (rough approximation)
		// Vermin font is relatively wide, so we use a conservative estimate
		const avgCharWidth = originalSize * 0.6; // Approximate character width
		const estimatedTextWidth = message.length * avgCharWidth;

		// If text fits comfortably, use original size
		if (estimatedTextWidth <= targetWidth) {
			return originalSize;
		}

		// Calculate scaling factor to fit text
		const scaleFactor = targetWidth / estimatedTextWidth;
		const scaledFontSize = Math.floor(originalSize * scaleFactor);

		// Set minimum font size to maintain readability
		const minFontSize = 24;
		return Math.max(scaledFontSize, minFontSize);
	}

	/**
	 * Extracts font family from font setting string.
	 * @param {string} fontSetting - Font setting (e.g., "96px Vermin")
	 * @returns {string} Font family name
	 */
	extractFontFamily(fontSetting) {
		// Extract everything after the px size
		const match = fontSetting.match(/\d+px\s+(.+)/);
		return match ? match[1] : 'Vermin';
	}
}

// TODO: Add support for timed messages
