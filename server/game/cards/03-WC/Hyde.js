const Card = require('../../Card.js');

class Hyde extends Card {
    // Reap: Draw a card. If you control Velum, draw 2 cards instead.
    // Destroyed: Archive Velum from your discard pile. If you do, archive Hyde.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.draw((context) => ({
                amount: context.player.cardsInPlay.some((card) => card.name === 'Velum') ? 2 : 1
            }))
        });

        this.destroyed({
            gameAction: ability.actions.archive((context) => ({
                location: 'discard',
                target: context.player.discard.filter((card) => card.name === 'Velum')
            })),
            then: {
                message: '{0} uses {1} to archive {1}',
                gameAction: ability.actions.archive()
            }
        });
    }
}

Hyde.id = 'hyde';

module.exports = Hyde;
