const _ = require('underscore');

const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');
const AbilityLimit = require('./abilitylimit.js');
const TriggeredAbilityContext = require('./TriggeredAbilityContext.js');

class TriggeredAbility extends BaseAbility {
    constructor(game, card, abilityType, properties) {
        super(properties);

        this.game = game;
        this.card = card;
        this.title = properties.title;
        this.limit = properties.limit || AbilityLimit.perRound(1);
        this.max = properties.max;
        this.when = properties.when;
        this.abilityType = abilityType;
        this.printedAbility = properties.printedAbility === false ? false : true;
        this.methods = properties.methods || [];
        this.cannotTargetFirst = !!properties.cannotTargetFirst;
        this.location = properties.location || [];
        if(!_.isArray(this.location)) {
            this.location = [this.location];
        }

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
        return new TriggeredAbilityContext({ event: event, game: this.game, source: this.card, player: this.card.controller, ability: this });
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
        
        return this.canResolveTargets(context);
    }

    isEventListeningLocation(location) {
        if(!location) {
            return false;
        }
        if(this.location.includes(location)) {
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
