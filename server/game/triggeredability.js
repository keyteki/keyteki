const _ = require('underscore');

const BaseAbility = require('./baseability.js');

class TriggeredAbilityContext {
    constructor(event, game, source) {
        this.event = event;
        this.game = game;
        this.source = source;
        this.player = source.controller;
    }

    cancel() {
        this.event.cancel();
    }

    skipHandler() {
        this.event.skipHandler();
    }
}

class TriggeredAbility extends BaseAbility {
    constructor(game, card, eventType, properties) {
        super(properties);

        this.game = game;
        this.card = card;
        this.limit = properties.limit;
        this.when = properties.when;
        this.eventType = eventType;
    }

    eventHandler(event) {
        var context = new TriggeredAbilityContext(event, this.game, this.card);

        if(!this.meetsRequirements(context)) {
            return;
        }

        this.executeReaction(context);
    }

    meetsRequirements(context) {
        if(this.game.currentPhase === 'setup') {
            return false;
        }

        if(this.limit && this.limit.isAtMax()) {
            return false;
        }

        if(this.card.isBlank()) {
            return false;
        }

        if(!this.when[context.event.name](...context.event.params)) {
            return false;
        }

        if(!this.canPayCosts(context) || !this.canResolveTargets(context)) {
            return false;
        }

        return true;
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
                handler: event => this.eventHandler(event)
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
