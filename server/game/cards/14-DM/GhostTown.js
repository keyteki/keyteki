const Card = require('../../Card.js');

class GhostTown extends Card {
    // Action: If you are haunted, archive a card. Otherwise, discard a card.
    setupCardAbilities(ability) {
        this.action({
            preferActionPromptMessage: true,
            gameAction: ability.actions.conditional((context) => ({
                condition: context.player.isHaunted(),
                trueGameAction: ability.actions.archive({
                    promptForSelect: {
                        location: 'hand',
                        controller: 'self',
                        message: '{0} uses {1} to archive a card',
                        messageArgs: [context.player, context.source]
                    }
                }),
                falseGameAction: ability.actions.discard({
                    promptForSelect: {
                        location: 'hand',
                        controller: 'self'
                    }
                })
            }))
        });
    }
}

GhostTown.id = 'ghost-town';

module.exports = GhostTown;
