const Card = require('../../Card.js');

class ChromaticGuardian extends Card {
    // After Fight/After Reap: If you are overwhelmed, destroy an enemy creature. Otherwise, destroy an enemy artifact.
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            preferActionPromptMessage: true,
            gameAction: ability.actions.conditional((context) => ({
                condition: context.player.isOverwhelmed(),
                trueGameAction: ability.actions.destroy({
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'opponent',
                        message: '{0} uses {1} to destroy {2}',
                        messageArgs: (cards) => [context.player, context.source, cards]
                    }
                }),
                falseGameAction: ability.actions.destroy({
                    promptForSelect: {
                        cardType: 'artifact',
                        controller: 'opponent',
                        message: '{0} uses {1} to destroy {2}',
                        messageArgs: (cards) => [context.player, context.source, cards]
                    }
                })
            }))
        });
    }
}

ChromaticGuardian.id = 'chromatic-guardian';

module.exports = ChromaticGuardian;
