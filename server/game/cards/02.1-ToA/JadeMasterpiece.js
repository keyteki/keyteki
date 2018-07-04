const DrawCard = require('../../drawcard.js');

class JadeMasterpiece extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a fate to an unclaimed ring',
            cost: ability.costs.bowSelf(),
            target: {
                mode: 'ring',
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: ring => ring.isUnclaimed() && ring.fate > 0,
                gameAction: ability.actions.placeFateOnRing(context => ({
                    origin: context.ring,
                    promptForSelect: {
                        activePromptTitle: 'Choose an unclaimed ring to move fate to',
                        ringCondition: ring => ring.isUnclaimed() && ring !== context.ring,
                        message: '{0} moves a fate from {1} to {2}',
                        messageArgs: ring => [context.player, context.ring, ring]
                    }
                }))
            },
            effect: 'move 1 fate from {0} to an unclaimed ring'
        });
    }
}

JadeMasterpiece.id = 'jade-masterpiece';

module.exports = JadeMasterpiece;
