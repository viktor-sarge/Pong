// An abstraction layer on top of Howler
// Should Howler ever need replacing it's nice to have a single place to refactor

/**
 * Audio handler class that provides an abstraction layer over Howler.js.
 * Handles audio loading, playback, and error management with graceful fallbacks.
 */
export default class AudioHandler {
	/**
	 * Creates a new AudioHandler instance and checks for audio availability.
	 */
	constructor() {
		this.sounds = [];
		this.audioAvailable = this.checkAudioAvailability();
	}

	/**
	 * Check if audio is available in the browser
	 * @returns {boolean} True if audio is supported
	 */
	checkAudioAvailability() {
		try {
			return typeof Howl !== 'undefined' && typeof Audio !== 'undefined';
		} catch (error) {
			console.warn('Audio not available:', error.message);
			return false;
		}
	}

	/**
	 * Register a sound file with error handling
	 * @param {string} file - Path to the audio file
	 * @returns {number|null} Sound index or null if failed
	 */
	registerSound(file) {
		if (!this.audioAvailable) {
			console.warn('Audio not available, cannot register sound:', file);
			return null;
		}

		if (!file || typeof file !== 'string') {
			console.error('Invalid file path provided to registerSound:', file);
			return null;
		}

		try {
			const sound = new Howl({
				src: [file],
				onloaderror: (id, error) => {
					console.error(`Failed to load audio file ${file}:`, error);
				},
				onplayerror: (id, error) => {
					console.error(`Failed to play audio file ${file}:`, error);
				},
			});

			const index = this.sounds.push(sound) - 1;
			console.log(`Registered sound ${file} with index ${index}`);
			return index;
		} catch (error) {
			console.error(
				`Error creating audio object for ${file}:`,
				error.message
			);
			return null;
		}
	}

	/**
	 * Play a sound by index with error handling
	 * @param {number} index - The sound index to play
	 * @returns {boolean} True if successfully started playing
	 */
	play(index) {
		if (!this.audioAvailable) {
			return false;
		}

		if (
			typeof index !== 'number' ||
			index < 0 ||
			index >= this.sounds.length
		) {
			console.warn('Invalid sound index:', index);
			return false;
		}

		if (!this.sounds[index]) {
			console.warn('Sound at index', index, 'is not available');
			return false;
		}

		try {
			this.sounds[index].play();
			return true;
		} catch (error) {
			console.error(
				`Failed to play sound at index ${index}:`,
				error.message
			);
			return false;
		}
	}

	/**
	 * Stop a sound by index with error handling
	 * @param {number} index - The sound index to stop
	 * @returns {boolean} True if successfully stopped
	 */
	stop(index) {
		if (!this.audioAvailable) {
			return false;
		}

		if (
			typeof index !== 'number' ||
			index < 0 ||
			index >= this.sounds.length
		) {
			console.warn('Invalid sound index:', index);
			return false;
		}

		if (!this.sounds[index]) {
			console.warn('Sound at index', index, 'is not available');
			return false;
		}

		try {
			this.sounds[index].stop();
			return true;
		} catch (error) {
			console.error(
				`Failed to stop sound at index ${index}:`,
				error.message
			);
			return false;
		}
	}

	/**
	 * Check if a sound is currently playing
	 * @param {number} index - The sound index to check
	 * @returns {boolean} True if the sound is playing
	 */
	playing(index) {
		if (!this.audioAvailable) {
			return false;
		}

		if (
			typeof index !== 'number' ||
			index < 0 ||
			index >= this.sounds.length
		) {
			return false;
		}

		if (!this.sounds[index]) {
			return false;
		}

		try {
			return this.sounds[index].playing();
		} catch (error) {
			console.error(
				`Failed to check playing status for sound at index ${index}:`,
				error.message
			);
			return false;
		}
	}

	/**
	 * Check if audio system is available
	 * @returns {boolean} True if audio is available
	 */
	isAvailable() {
		return this.audioAvailable;
	}
}
