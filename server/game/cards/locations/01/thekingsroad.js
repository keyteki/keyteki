const DrawCard = require('../../../drawcard.js');

class TheKingsroad extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });
        this.action({
            title: 'Kneel and sacrifice',
            clickToActivate: true,
            phase: 'marshal',
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            handler: () => {
                this.game.addMessage('{0} kneels and sacrifices {1} to reduce the cost of the next character by 3', this.controller, this);
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(3, card => card.getType() === 'character')
                }));
            }
        });
    }
}

TheKingsroad.code = '01039';

module.exports = TheKingsroad;
