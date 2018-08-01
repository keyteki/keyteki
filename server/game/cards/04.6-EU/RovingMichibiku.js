const DrawCard = require('../../drawcard.js');

class RovingMichibiku extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Take a ring from opponent\'s claimed pool',
            when: {
                afterConflict: (event, context) => context.source.isAttacking() && event.conflict.winner === context.player
            },
            gameAction: ability.actions.takeRing(context => ({
                promptForSelect: {
                    activePromptTitle: 'Choose a ring to take',
                    ringCondition: ring => ring.claimedBy === context.player.opponent.name,
                    message: '{0} takes {1}',
                    messageArgs: ring => [context.player, ring]
                }
            }))
        });
    }
}

RovingMichibiku.id = 'roving-michibiku';

module.exports = RovingMichibiku;
