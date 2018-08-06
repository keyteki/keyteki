const DrawCard = require('../../drawcard.js');

class KnowTheWorld extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Switch a claimed ring with an unclaimed one',
            effect: 'switch a claimed ring with an unclaimed one',
            gameAction: ability.actions.jointAction([
                ability.actions.returnRing(context => ({
                    promptForSelect: {
                        activePromptTitle: 'Choose a ring to return',
                        ringCondition: ring => ring.claimedBy === context.player.name,
                        message: '{0} returns {1}',
                        messageArgs: ring => [context.player, ring]
                    }
                })),
                ability.actions.takeRing(context => ({
                    takeFate: true,
                    promptForSelect: {
                        activePromptTitle: 'Choose a ring to take',
                        ringCondition: ring => ring.isUnclaimed(),
                        message: '{0} takes {1}',
                        messageArgs: ring => [context.player, ring]
                    }
                }))
            ])
        });
    }
}

KnowTheWorld.id = 'know-the-world';

module.exports = KnowTheWorld;
