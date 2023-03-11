// TODO: Move code here to set up game loop
// Should have a method to switch to provided mode 
// Modes and their respective update/draw functions should be provided to constructor
import Messages from "./messages.js";
import AudioHandler from "./audio.js";

export default class GameEngine {
    constructor(config) {
        this.messages = new Messages;
        this.audio = new AudioHandler;
    }

    update() {

    }

    draw() {

    }

    setGameMode(mode) {

    }
}