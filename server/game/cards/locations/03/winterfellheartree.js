const DrawCard = require('../../../drawcard.js');

class WinterfellHeartTree extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Select character to grant immunity',
                cardCondition: card => card.controller === this.controller && card.isFaction('stark')
            },
            handler: context => {
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    effect: ability.effects.immuneTo(card => card.controller !== this.controller && card.getType() === 'plot')
                }));
            }
        });
    }
}

WinterfellHeartTree.code = '03018';

module.exports = WinterfellHeartTree;
