export default class Datastorage {
	constructor() {
		this.available = this.checkAvailability();
	}

	/**
	 * Check if localStorage is available and working
	 * @returns {boolean} True if localStorage is available
	 */
	checkAvailability() {
		try {
			const test = '__localStorage_test__';
			localStorage.setItem(test, 'test');
			localStorage.removeItem(test);
			return true;
		} catch (error) {
			console.warn('localStorage is not available:', error.message);
			return false;
		}
	}

	/**
	 * Get a value from localStorage with error handling
	 * @param {string} key - The key to retrieve
	 * @returns {string|null} The stored value or null if not found/error
	 */
	get(key) {
		if (!this.available) {
			console.warn('Storage not available, returning null for key:', key);
			return null;
		}

		if (!key || typeof key !== 'string') {
			console.warn('Invalid key provided to storage.get:', key);
			return null;
		}

		try {
			return localStorage.getItem(key);
		} catch (error) {
			console.error(
				'Failed to get item from localStorage:',
				error.message
			);
			return null;
		}
	}

	/**
	 * Store a value in localStorage with error handling
	 * @param {string} key - The key to store under
	 * @param {any} value - The value to store (will be converted to string)
	 * @returns {boolean} True if successfully stored, false otherwise
	 */
	put(key, value) {
		if (!this.available) {
			console.warn('Storage not available, cannot store key:', key);
			return false;
		}

		if (!key || typeof key !== 'string') {
			console.warn('Invalid key provided to storage.put:', key);
			return false;
		}

		try {
			localStorage.setItem(key, String(value));
			return true;
		} catch (error) {
			if (error.name === 'QuotaExceededError') {
				console.error(
					'localStorage quota exceeded. Cannot store more data.'
				);
			} else {
				console.error(
					'Failed to store item in localStorage:',
					error.message
				);
			}
			return false;
		}
	}

	/**
	 * Remove a value from localStorage with error handling
	 * @param {string} key - The key to remove
	 * @returns {boolean} True if successfully removed, false otherwise
	 */
	remove(key) {
		if (!this.available) {
			console.warn('Storage not available, cannot remove key:', key);
			return false;
		}

		if (!key || typeof key !== 'string') {
			console.warn('Invalid key provided to storage.remove:', key);
			return false;
		}

		try {
			localStorage.removeItem(key);
			return true;
		} catch (error) {
			console.error(
				'Failed to remove item from localStorage:',
				error.message
			);
			return false;
		}
	}

	/**
	 * Check if storage is available
	 * @returns {boolean} True if storage is available
	 */
	isAvailable() {
		return this.available;
	}
}
