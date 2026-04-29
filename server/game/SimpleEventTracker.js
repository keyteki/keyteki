const EventRegistrar = require('./eventregistrar.js');
const { EVENTS } = require('./Events/types.js');

class SimpleEventTracker {
    /**
     * @param {import('./game')} game
     * @param {import('./Events/types').EventName} event
     */
    constructor(game, event) {
        this.events = [];
        this.tracker = new EventRegistrar(game, this);
        this[event] = (event) => this.events.push(event);
        this.tracker.register([EVENTS.onTurnEnd, event]);
    }

    onTurnEnd() {
        this.events = [];
    }
}

module.exports = SimpleEventTracker;
