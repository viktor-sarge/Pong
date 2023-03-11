// TODO: Refactor to be an abstraction layer on top of Howler
// Should have a .register(sound) method returning a ref
// Register new howler sounds in a map and return the key
// a .play(ref) method provides playback functionality
// Howler will likely not be switched out, but at least it's possible

export default class AudioHandler{
    constructor() {
        this.sounds = [];
    }

    registerSound(file) {
        const sound = new Howl({src: file});
        const index = this.sounds.push(sound) - 1;
        console.log(`Registered sound with index ${index}`);
        return index;
    }

    play(soundIndex) {
        this.sounds[soundIndex].play();
    }
}