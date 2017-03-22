const DrawCard = require('../drawcard.js');

class FactionCostReducer extends DrawCard {
    constructor(owner, cardData, reduceBy, faction) {
        super(owner, cardData);

        this.reduceBy = reduceBy;
        this.faction = faction;
    }

    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.game.addMessage('{0} uses {1} to reduce the cost of the next {2} card by {3}',
                    this.controller, this, this.faction, this.reduceBy);
                this.untilEndOfPhase(ability => ({
                    condition: () => !context.abilityDeactivated,
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(this.reduceBy, card => card.isFaction(this.faction))
                }));
            }
        });
    }
}

class FactionCharacterCostReducer extends DrawCard {
    constructor(owner, cardData, reduceBy, faction) {
        super(owner, cardData);

        this.reduceBy = reduceBy;
        this.faction = faction;
    }

    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.game.addMessage('{0} uses {1} to reduce the cost of the next {2} character by {3}',
                    this.controller, this, this.faction, this.reduceBy);
                this.untilEndOfPhase(ability => ({
                    condition: () => !context.abilityDeactivated,
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        this.reduceBy,
                        card => card.getType() === 'character' && card.isFaction(this.faction)
                    )
                }));
            }
        });
    }
}

module.exports = {
    FactionCostReducer: FactionCostReducer,
    FactionCharacterCostReducer: FactionCharacterCostReducer
};
