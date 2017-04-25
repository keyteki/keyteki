const DrawCard = require('../../../drawcard');

class OceanRoad extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce',
            clickToActivate: true,
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.game.addMessage('{0} uses {1} to reduce the cost of the next neutral or out of faction card by 1',
                    this.controller, this);
                this.untilEndOfPhase(ability => ({
                    condition: () => !context.abilityDeactivated,
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(
                        1,
                        card => card.isFaction('neutral') || !card.isFaction(this.controller.faction.getPrintedFaction())
                    )
                }));
            }
        });
    }
}

OceanRoad.code = '05042';

module.exports = OceanRoad;
