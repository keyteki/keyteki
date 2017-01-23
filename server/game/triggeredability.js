const _ = require('underscore');

class TriggeredAbilityContext {
    constructor(event, game, source) {
        this.event = event;
        this.game = game;
        this.source = source;
    }

    cancel() {
        this.event.cancel();
    }

    skipHandler() {
        this.event.skipHandler();
    }
}

class TriggeredAbility {
    constructor(game, card, eventType, properties) {
        this.game = game;
        this.card = card;
        this.limit = properties.limit;
        this.when = properties.when;
        this.eventType = eventType;
    }

    createEventHandlerFor(eventName) {
        return (...args) => {
            if(this.game.currentPhase === 'setup') {
                return;
            }

            if(this.limit && this.limit.isAtMax()) {
                return;
            }

            if(this.card.isBlank()) {
                return;
            }

            if(!this.when[eventName](...args)) {
                return;
            }

            this.executeReaction(new TriggeredAbilityContext(args[0], this.game, this.source));
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
                name: eventName + ':' + this.eventType,
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

module.exports = TriggeredAbility;
