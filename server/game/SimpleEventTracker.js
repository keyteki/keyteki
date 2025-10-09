const EventRegistrar = require('./eventregistrar.js');

class SimpleEventTracker {
    constructor(game, event) {
        this.events = [];
        this.tracker = new EventRegistrar(game, this);
        this[event] = (event) => this.events.push(event);
        this.tracker.register(['onTurnEnded', event]);
    }

    onTurnEnded() {
        this.events = [];
    }
}

module.exports = SimpleEventTracker;
