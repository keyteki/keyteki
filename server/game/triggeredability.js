const _ = require('underscore');

const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');
const AbilityLimit = require('./abilitylimit.js');

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
}

class TriggeredAbility extends BaseAbility {
    constructor(game, card, abilityType, properties) {
        super(properties);

        this.game = game;
        this.card = card;
        this.limit = properties.limit || AbilityLimit.perRound(1);
        this.when = properties.when;
        this.abilityType = abilityType;
        this.location = properties.location;

        if(card.getType() === 'event' && !properties.ignoreEventCosts) {
            this.cost.push(Costs.playEvent());
        }
    }

    eventHandler(event) {
        if(!this.isTriggeredByEvent(event)) {
            return;
        }

        this.game.registerAbility(this, event);
    }

    createContext(event) {
        return new TriggeredAbilityContext(event, this.game, this.card);
    }

    isTriggeredByEvent(event) {
        let listener = this.when[event.name];

        if(!listener) {
            return false;
        }

        return listener(...event.params);
    }

    meetsRequirements(context) {
        if(this.game.currentPhase === 'setup') {
            return false;
        }
        /*
        if(!this.isForcedAbility() && context.player) {
            return false;
        }
        */
        if(this.limit && this.limit.isAtMax()) {
            return false;
        }

        if(this.card.isBlank()) {
            return false;
        }

        if(!this.isTriggeredByEvent(context.event)) {
            return false;
        }

        if(!this.card.canTriggerAbilities(this.location)) {
            return false;
        }
        
        if(!this.canPayCosts(context) || !this.canResolveTargets(context)) {
            return false;
        }

        return true;
    }

    isEventListeningLocation(location) {
        if(!location) {
            return false;
        }
        if(location === this.location) {
            return true;
        }
        
        if(location.includes('deck')) {
            return false;
        }
        
        let type = this.card.getType();
        if(type === 'character' || type === 'attachment') {
            return (location === 'play area');
        } else if(type === 'event') {
            return (location === 'hand');
        } else if(type === 'role' || location.includes('province')) {
            return true;
        }
        return false;
    }

    isAction() {
        return false;
    }

    isCardPlayed() {
        return this.card.getType() === 'event';
    }

    isForcedAbility() {
        return false;
    }

    registerEvents() {
        if(this.events) {
            return;
        }

        var eventNames = _.keys(this.when);

        this.events = [];
        _.each(eventNames, eventName => {
            var event = {
                name: eventName + ':' + this.abilityType,
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
