const Card = require('../../Card.js');

class GhostTown extends Card {
    // Action: If you are haunted, archive a card. Otherwise, discard a card.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.isHaunted(),
                trueGameAction: ability.actions.archive((context) => ({
                    promptForSelect: {
                        location: 'hand',
                        controller: 'self',
                        message: '{0} uses {1} to archive {2}',
                        messageArgs: (cards) => [context.player, context.source.name, cards]
                    }
                })),
                falseGameAction: ability.actions.discard((context) => ({
                    promptForSelect: {
                        location: 'hand',
                        controller: 'self',
                        message: '{0} uses {1} to discard {2}',
                        messageArgs: (cards) => [context.player, context.source.name, cards]
                    }
                }))
            }),
            effect: '{1}',
            effectArgs: (context) => [
                context.player.isHaunted() ? 'archive a card' : 'discard a card'
            ]
        });
    }
}

GhostTown.id = 'ghost-town';

module.exports = GhostTown;
