const _ = require('underscore');

const AbilityContext = require('./AbilityContext.js');
const AbilityLimit = require('./abilitylimit.js');
const BaseAbility = require('./baseability.js');
const Costs = require('./costs.js');

class CardAbility extends BaseAbility {
    constructor(game, card, properties) {
        super(properties);

        this.game = game;
        this.card = card;
        this.title = properties.title;
        this.limit = properties.limit || AbilityLimit.perRound(1);
        this.max = properties.max;
        this.location = properties.location || [];
        this.printedAbility = properties.printedAbility === false ? false : true;
        this.cannotBeCopied = properties.cannotBeCopied;
        this.cannotBeCancelled = properties.cannotBeCancelled;
        this.cannotTargetFirst = !!properties.cannotTargetFirst;
        this.doesNotTarget = properties.doesNotTarget;
        this.methods = properties.methods || [];
        this.handler = properties.handler;

        if(!_.isArray(this.location)) {
            if(this.location === 'province') {
                this.location = ['province 1', 'province 2', 'province 3', 'province 4'];
            } else {
                this.location = [properties.location];
            }
        }

        if(card.getType() === 'event') {
            this.cost.push(Costs.playEvent());
        }

        this.cost.push(Costs.useLimit());
    }

    createContext(player) {
        return new AbilityContext({
            ability: this,
            game: this.game,
            player: player,
            source: this.card
        });
    }

    meetsRequirements(context) {
        if(!this.card.canTriggerAbilities(this.location)) {
            return false;
        }

        if(this.card.isBlank() && this.printedAbility) {
            return false ;
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

    isCardPlayed() {
        return this.card.getType() === 'event';
    }

    isCardAbility() {
        return true;
    }
}

module.exports = CardAbility;
