import EventRegistrar from './eventregistrar.js';

class SimpleEventTracker {
    constructor(game, event) {
        this.events = [];
        this.tracker = new EventRegistrar(game, this);
        this[event] = (event) => this.events.push(event);
        this.tracker.register(['onRoundEnded', event]);
    }

    onRoundEnded() {
        this.events = [];
    }
}

export default SimpleEventTracker;
