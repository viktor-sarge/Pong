// An abstraction layer on top of Howler
// Should Howler ever need replacing it's nice to have a single place to refactor

export default class AudioHandler{
    constructor() {
        this.sounds = [];
    }

    registerSound(file) {
        const sound = new Howl({src: file});
        const index = this.sounds.push(sound) - 1;
        console.log(`Registered sound ${file} with index ${index}`);
        return index;
    }

    play(soundIndex) {
        this.sounds[soundIndex].play();
    }
}