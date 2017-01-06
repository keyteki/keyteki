const _ = require('underscore');

class BaseCardReaction {
    constructor(game, card, properties) {
        this.game = game;
        this.card = card;
        this.limit = properties.limit;
        this.when = properties.when;
    }

    createEventHandlerFor(eventName) {
        return (...args) => {
            if(this.limit && this.limit.isAtMax()) {
                return;
            }

            if(this.card.isBlank()) {
                return;
            }

            if(!this.when[eventName](...args)) {
                return;
            }

            this.executeReaction();
        };
    }

    executeReaction() {
    }

    registerEvents() {
        if(this.events) {
            return;
        }

        var eventNames = _.keys(this.when);

        this.events = [];
        _.each(eventNames, eventName => {
            var event = {
                name: eventName,
                handler: this.createEventHandlerFor(eventName)
            };
            this.game.on(event.name, event.handler);
            this.events.push(event);
        });

        if(this.limit) {
            this.limit.registerEvents(this.game);
        }
    }

    unregisterEvents() {
        if(this.events) {
            _.each(this.events, event => {
                this.game.removeListener(event.name, event.handler);
            });
            if(this.limit) {
                this.limit.unregisterEvents(this.game);
            }
            this.events = null;
        }
    }
}

module.exports = BaseCardReaction;
