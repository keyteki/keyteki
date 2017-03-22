const DrawCard = require('../../../drawcard.js');

class TourneyGrounds extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to reduce event',
            clickToActivate: true,
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    condition: () => !context.abilityDeactivated,
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.reduceNextPlayedCardCost(1, card => card.getType() === 'event')
                }));

                this.game.addMessage('{0} kneels {1} to reduce the cost of the next event they play by 1', this.controller, this);
            }
        });
    }
}

TourneyGrounds.code = '03042';

module.exports = TourneyGrounds;
