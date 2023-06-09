const Card = require('../../Card.js');

class Eyegor extends Card {
    // Play: Look at the top 3cards of your deck. Add 1to your hand and discard the others.
    setupCardAbilities(ability) {
        this.play({
            effect: 'to look at the top 3 cards of their deck',
            gameAction: ability.actions.moveCard((context) => ({
                destination: 'hand',
                promptWithHandlerMenu: {
                    activePromptTitle: 'Choose a card to add to hand',
                    cards: context.player.deck.slice(0, 3),
                    message: '{0} adds a card to their hand and discards the other 2'
                }
            })),
            then: {
                gameAction: ability.actions.discard((context) => ({
                    target: context.player.deck.slice(0, 2)
                }))
            }
        });
    }
}

Eyegor.id = 'eyegor';

module.exports = Eyegor;
