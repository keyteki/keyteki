const Card = require('../../Card.js');
const _ = require('underscore');

class Reiteration extends Card {
    // Play: Draw 2 cards. Put 2 cards from your hand on the bottom of your deck.
    // Fate: Discard 2 random cards from your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.draw({ amount: 2 }),
            then: {
                alwaysTriggers: true,
                target: {
                    controller: 'self',
                    location: 'hand',
                    mode: 'exactly',
                    numCards: 2,
                    gameAction: ability.actions.returnToDeck({
                        shuffle: false,
                        bottom: true
                    })
                },
                message: '{0} uses {1} to return {3} card{4} to the bottom of their deck',
                messageArgs: (context) => [
                    context.player.hand.length === 1 ? 'a' : '2',
                    context.player.hand.length === 1 ? '' : 's'
                ]
            }
        });

        this.fate({
            gameAction: ability.actions.discard((context) => ({
                target: _.shuffle(context.game.activePlayer.hand).slice(0, 2)
            }))
        });
    }
}

Reiteration.id = 'reiteration';

module.exports = Reiteration;
