const Card = require('../../Card.js');

class Reiteration extends Card {
    // Play: Draw 2 cards. Put 2 cards from your hand on the bottom of your deck.
    // Fate: Discard 2 random cards from your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.draw({ amount: 2 }),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.sequential([
                    ability.actions.returnToDeck({
                        promptForSelect: {
                            controller: 'self',
                            location: 'hand'
                        },
                        shuffle: false,
                        bottom: true
                    }),
                    ability.actions.returnToDeck({
                        promptForSelect: {
                            controller: 'self',
                            location: 'hand'
                        },
                        shuffle: false,
                        bottom: true
                    })
                ]),
                message: '{0} uses {1} to return {3} card{4} to the bottom of their deck',
                messageArgs: (context) => [
                    context.player.hand.length === 1 ? 'a' : '2',
                    context.player.hand.length === 1 ? '' : 's'
                ]
            }
        });

        this.fate({
            gameAction: ability.actions.discardAtRandom((context) => ({
                target: context.game.activePlayer,
                amount: 2
            }))
        });
    }
}

Reiteration.id = 'reiteration';

module.exports = Reiteration;
