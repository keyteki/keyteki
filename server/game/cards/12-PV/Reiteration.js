const Card = require('../../Card.js');
const _ = require('underscore');

class Reiteration extends Card {
    // Play: Draw 2 cards. Put 2 cards from your hand on the bottom of your deck.
    // Fate: Discard 2 random cards from your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.draw({ amount: 2 }),
                ability.actions.returnToDeck((context) => ({
                    promptForSelect: {
                        controller: 'self',
                        location: 'hand',
                        message: '{0} uses {1} to return {2} to the bottom of their deck',
                        messageArgs: (cards) => [context.player, context.source.name, cards]
                    },
                    shuffle: false,
                    bottom: true
                })),
                ability.actions.returnToDeck((context) => ({
                    promptForSelect: {
                        controller: 'self',
                        location: 'hand',
                        message: '{0} uses {1} to return {2} to the bottom of their deck',
                        messageArgs: (cards) => [context.player, context.source.name, cards]
                    },
                    shuffle: false,
                    bottom: true
                }))
            ]),
            effect: 'draw 2 cards and return 2 cards to the bottom of their deck'
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
