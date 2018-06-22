class BaseCardSelector {
    constructor(properties) {
        this.cardCondition = properties.cardCondition;
        this.cardType = properties.cardType;
        this.optional = properties.optional;
        this.location = this.buildLocation(properties.location);
        this.controller = properties.controller || 'any';

        if(!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType];
        }
    }

    buildLocation(property) {
        let location = property || 'play area';
        if(!Array.isArray(location)) {
            location = [location];
        }
        let index = location.indexOf('province');
        if(index > -1) {
            location.splice(index, 1, 'province 1', 'province 2', 'province 3', 'province 4', 'stronghold province');
        }
        return location;
    }

    findPossibleCards(context) {
        if(this.location.includes('any')) {
            if(this.controller === 'self') {
                return context.game.allCards.filter(card => card.controller === context.player);
            } else if(this.controller === 'opponent') {
                return context.game.allCards.filter(card => card.controller === context.player.opponent);
            }
            return context.game.allCards.toArray();
        }
        let possibleCards = [];
        if(this.controller !== 'opponent') {
            possibleCards = this.location.reduce((array, location) => {
                let cards = context.player.getSourceList(location).toArray();
                if(location === 'play area') {
                    return array.concat(cards, ...cards.map(card => card.attachments.toArray()));
                }
                return array.concat(cards);
            }, possibleCards);
        }
        if(this.controller !== 'self' && context.player.opponent) {
            possibleCards = this.location.reduce((array, location) => {
                let cards = context.player.opponent.getSourceList(location).toArray();
                if(location === 'play area') {
                    return array.concat(cards, ...cards.map(card => card.attachments.toArray()));
                }
                return array.concat(cards);
            }, possibleCards);
        }
        return possibleCards;
    }

    canTarget(card, context) {
        if(!card) {
            return false;
        }
        if(context.stage.includes('target') && !card.checkRestrictions('target', context)) {
            return false;
        }
        if(this.controller === 'self' && card.controller !== context.player) {
            return false;
        }
        if(this.controller === 'opponent' && card.controller !== context.player.opponent) {
            return false;
        }
        if(!this.location.includes('any') && !this.location.includes(card.location)) {
            return false;
        }
        return this.cardType.includes(card.getType()) && this.cardCondition(card, context);
    }

    getAllLegalTargets(context) {
        return this.findPossibleCards(context).filter(card => this.canTarget(card, context));
    }

    hasEnoughSelected(selectedCards) {
        return this.optional || selectedCards.length > 0;
    }

    hasEnoughTargets(context) {
        return (this.optional || this.findPossibleCards(context).some(card => this.canTarget(card, context)));
    }

    defaultActivePromptTitle() {
        return 'Choose cards';
    }

    automaticFireOnSelect() {
        return false;
    }

    wouldExceedLimit(selectedCards, card) { // eslint-disable-line no-unused-vars
        return false;
    }

    hasReachedLimit(selectedCards) { // eslint-disable-line no-unused-vars
        return false;
    }

    hasExceededLimit(selectedCards) { // eslint-disable-line no-unused-vars
        return false;
    }

    formatSelectParam(cards) {
        return cards;
    }
}

module.exports = BaseCardSelector;
