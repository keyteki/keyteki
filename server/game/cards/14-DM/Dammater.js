const Card = require('../../Card.js');

class Dammater extends Card {
    // Play: Draw 3 cards. Discard 2 cards. Archive a card.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.draw({ amount: 3 }),
            then: {
                alwaysTriggers: true,
                target: {
                    activePromptTitle: 'Choose {{amount}} cards to discard',
                    location: 'hand',
                    controller: 'self',
                    mode: 'exactly',
                    numCards: 2,
                    gameAction: ability.actions.discard()
                },
                then: {
                    alwaysTriggers: true,
                    message: '{0} uses {1} to archive a card',
                    messageArgs: (context) => [context.player, context.source],
                    target: {
                        activePromptTitle: 'Choose a card to archive',
                        location: 'hand',
                        controller: 'self',
                        gameAction: ability.actions.archive()
                    }
                }
            }
        });
    }
}

Dammater.id = 'dammater';

module.exports = Dammater;
