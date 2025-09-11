const Card = require('../../Card.js');

class CaptainNemo extends Card {
    // After Fight: Destroy an artifact and a creature.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: [
                ability.actions.destroy((context) => ({
                    promptForSelect: {
                        activePromptTitle: 'Choose an artifact to destroy',
                        cardType: 'artifact',
                        message: '{0} uses {1} to destroy {2}',
                        messageArgs: (card) => [context.player, context.source, card]
                    }
                })),
                ability.actions.destroy((context) => ({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to destroy',
                        cardType: 'creature',
                        message: '{0} uses {1} to destroy {2}',
                        messageArgs: (card) => [context.player, context.source, card]
                    }
                }))
            ],
            effect: 'to destroy an artifact and a creature'
        });
    }
}

CaptainNemo.id = 'captain-nemo';

module.exports = CaptainNemo;
