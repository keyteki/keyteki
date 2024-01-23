const Card = require('../../Card.js');

class DumaTheReturned extends Card {
    // Destroyed: Return the top 3 cards of your discard pile to your
    // hand. If you are haunted, archive Duma the Returned.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.returnToHand((context) => ({
                location: 'discard',
                target: context.player.discard.slice(0, 3)
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) => context.source.controller.isHaunted(),
                gameAction: ability.actions.archive(),
                message: '{0} uses {1} to archive {1}'
            }
        });
    }
}

DumaTheReturned.id = 'duma-the-returned';

module.exports = DumaTheReturned;
