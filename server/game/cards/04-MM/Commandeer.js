const Card = require('../../Card.js');

class Commandeer extends Card {
    // Play: For the remainder of the turn, after you play another card, a friendly creature captures 1A.
    setupCardAbilities(ability) {
        this.play({
            effect: 'capture an amber after playing a card for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        event.player === context.player && event.card !== context.source
                },
                preferActionPromptMessage: true,
                gameAction: ability.actions.capture({
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'self',
                        message:
                            '{0} uses {1} to capture amber from their opponent and place on {2}',
                        messageArgs: (card) => [context.player, context.source, card]
                    }
                })
            }))
        });
    }
}

Commandeer.id = 'commandeer';

module.exports = Commandeer;
