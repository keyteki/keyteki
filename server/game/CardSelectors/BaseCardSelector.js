class BaseCardSelector {
    constructor(properties) {
        this.cardCondition = properties.cardCondition;
        this.cardType = properties.cardType;
        this.optional = properties.optional;
        this.location = this.buildLocation(properties.location);
        this.controller = properties.controller || 'any';
        this.checkTarget = properties.targets;
        this.uniqueCardNames = properties.uniqueCardNames;
        this.uniqueCardHouses = properties.uniqueCardHouses;

        if (!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType];
        }
    }

    buildLocation(property) {
        let location = property || ['play area'];
        if (!Array.isArray(location)) {
            location = [location];
        }

        return location;
    }

    findPossibleCards(context) {
        if (this.location.includes('any')) {
            if (this.controller === 'self') {
                return context.game.allCards.filter((card) => card.controller === context.player);
            } else if (this.controller === 'opponent') {
                return context.game.allCards.filter(
                    (card) => card.controller === context.player.opponent
                );
            }

            return context.game.allCards;
        }

        let upgrades = context.player.cardsInPlay.reduce(
            (array, card) => array.concat(card.upgrades),
            []
        );
        if (context.player.opponent) {
            upgrades = upgrades.concat(
                ...context.player.opponent.cardsInPlay.map((card) => card.upgrades)
            );
        }

        let possibleCards = [];
        if (this.controller !== 'opponent') {
            possibleCards = this.location.reduce((array, location) => {
                let cards = context.player.getSourceList(location);
                if (location === 'play area') {
                    return array.concat(
                        cards,
                        upgrades.filter((card) => card.controller === context.player)
                    );
                }

                return array.concat(cards);
            }, possibleCards);
        }

        if (this.controller !== 'self' && context.player.opponent) {
            possibleCards = this.location.reduce((array, location) => {
                let cards = context.player.opponent.getSourceList(location);
                if (location === 'play area') {
                    return array.concat(
                        cards,
                        upgrades.filter((card) => card.controller === context.player.opponent)
                    );
                }

                return array.concat(cards);
            }, possibleCards);
        }

        return possibleCards;
    }

    canTarget(card, context) {
        if (!card) {
            return false;
        }

        if (this.checkTarget && !card.checkRestrictions('target', context)) {
            return false;
        }

        if (this.controller === 'self' && card.controller !== context.player) {
            return false;
        }

        if (this.controller === 'opponent' && card.controller !== context.player.opponent) {
            return false;
        }

        if (!this.location.includes('any') && !this.location.includes(card.location)) {
            return false;
        }

        return this.cardType.includes(card.getType()) && this.cardCondition(card, context);
    }

    getAllLegalTargets(context) {
        return this.findPossibleCards(context).filter((card) => this.canTarget(card, context));
    }

    // eslint-disable-next-line no-unused-vars
    hasEnoughSelected(selectedCards, context) {
        return this.optional || selectedCards.length > 0;
    }

    hasEnoughTargets(context) {
        return this.findPossibleCards(context).some((card) => this.canTarget(card, context));
    }

    defaultActivePromptTitle() {
        return 'Choose cards';
    }

    automaticFireOnSelect() {
        return false;
    }

    // eslint-disable-next-line no-unused-vars
    wouldExceedLimit(selectedCards, card) {
        return false;
    }

    // eslint-disable-next-line no-unused-vars
    hasReachedLimit(selectedCards) {
        return false;
    }

    // eslint-disable-next-line no-unused-vars
    hasExceededLimit(selectedCards) {
        return false;
    }

    formatSelectParam(cards) {
        return cards;
    }

    canAddCardToSelection(selectedCards, possibleCardToSelect) {
        if (this.uniqueCardNames) {
            if (selectedCards.some((card) => card.name === possibleCardToSelect.name)) {
                return false;
            }
        }

        if (this.uniqueCardHouses) {
            if (
                selectedCards.some((card) =>
                    card.getHouses().some((house) => possibleCardToSelect.hasHouse(house))
                )
            ) {
                return false;
            }
        }

        return true;
    }
}

module.exports = BaseCardSelector;
