const _ = require('underscore');

const CardAbility = require('./CardAbility.js');
const TriggeredAbilityContext = require('./TriggeredAbilityContext.js');

class TriggeredAbility extends CardAbility {
    constructor(game, card, abilityType, properties) {
        super(game, card, properties);

        this.when = properties.when;
        this.abilityType = abilityType;
        this.maxIdentifier = this.card.name + this.printedAbility ? this.card.id + this.card.abilities.reactions.length : '';

        if(this.max) {
            this.card.owner.registerAbilityMax(this.maxIdentifier, this.max);
            this.cost.push(Costs.playMax());
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
        if(!this.isTriggeredByEvent(context.event)) {
            return false;
        }

        return super.meetsRequirements(context);
    }

    isAction() {
        return false;
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
