const Card = require('../../Card.js');

class Velum extends Card {
    // Reap: Archive a card. If you control Hyde, archive 2 cards instead.
    // Destroyed: Archive Hyde from your discard pile. If you do, archive Velum.
    setupCardAbilities(ability) {
        this.reap({
            preferActionPromptMessage: true,
            gameAction: ability.actions.archive((context) => ({
                promptForSelect: {
                    location: 'hand',
                    controller: 'self',
                    mode: 'exactly',
                    message: '{0} uses {1} to archive {2} card',
                    messageArgs: (cards) => [context.player, context.source, cards.length],
                    numCards: context.player.cardsInPlay.some((card) => card.name === 'Hyde')
                        ? 2
                        : 1
                }
            }))
        });

        this.destroyed({
            gameAction: ability.actions.archive((context) => ({
                location: 'discard',
                target: context.player.discard.filter((card) => card.name === 'Hyde')
            })),
            then: {
                message: '{0} uses {1} to archive {1}',
                gameAction: ability.actions.archive()
            }
        });
    }
}

Velum.id = 'velum';

module.exports = Velum;
