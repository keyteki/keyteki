const DrawCard = require('../../../drawcard.js');

class GreatHall extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce next unique character',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let amount = card => card.getCost() >= 6 ? 2 : 1;
                this.game.addMessage('{0} kneels {1} to reduce the cost of the next unique character by 1 (by 2 if it has cost of 6 or more)', context.player, this);
                this.untilEndOfPhase(ability => ({
                    condition: () => !context.abilityDeactivated,
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        amount,
                        card => card.getType() === 'character' && card.isUnique()
                    )
                }));
            }
        });
    }
}

GreatHall.code = '06038';

module.exports = GreatHall;
