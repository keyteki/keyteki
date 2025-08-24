const Card = require('../../Card.js');

class Reaver extends Card {
    // After Reap: Move 1 A from a friendly creature to your pool. If you do,
    // discard a card.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                activePromptTitle: 'Choose a captured amber to move to your pool.',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.removeAmber()
            },
            effect: 'move 1 amber from {0} to their pool',
            then: {
                gameAction: ability.actions.gainAmber(),
                then: {
                    target: {
                        controller: 'self',
                        location: 'hand',
                        gameAction: ability.actions.discard()
                    },
                    messageArgs: (context) => [context.target]
                }
            }
        });
    }
}

Reaver.id = 'reaver';

module.exports = Reaver;
