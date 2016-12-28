const _ = require('underscore');

class EventRegistrar {
    constructor(game, context) {
        this.game = game;
        this.context = context;
        this.events = [];
    }

    register(eventNames) {
        _.each(eventNames, eventName => {
            var boundHandler = this.context[eventName].bind(this.context);
            this.game.on(eventName, boundHandler);
            this.events.push({ name: eventName, handler: boundHandler });
        });
    }

    unregisterAll() {
        _.each(this.events, event => {
            this.game.removeListener(event.name, event.handler);
        });
        this.events = [];
    }
}

module.exports = EventRegistrar;
