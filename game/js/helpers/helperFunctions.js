/**
 * Helper function that determines if an entity is moving right based on its angle.
 * @param {number} angle - The angle in radians
 * @returns {boolean} True if the angle points right (positive X direction), false otherwise
 */
export function anglePointingRight(angle) {
	return Math.cos(angle) > 0; // Positive cosine means right
}
