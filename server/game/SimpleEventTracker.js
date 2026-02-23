import EventRegistrar from './eventregistrar.js';
import { EVENTS } from './Events/types.js';
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

export default SimpleEventTracker;
