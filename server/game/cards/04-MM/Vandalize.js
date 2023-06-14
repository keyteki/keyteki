const Card = require('../../Card.js');

class Vandalize extends Card {
    // Play: Look at the top 3 cards of your opponents deck. Discard 1 and put the others back in any order.
    setupCardAbilities(ability) {
        this.play({
            effect: 'discard a card and rearrange the top 2 cards',
            gameAction: ability.actions.discard((context) => ({
                promptWithHandlerMenu: {
                    activePromptTitle: 'Choose a card to discard',
                    cards: context.player.opponent ? context.player.opponent.deck.slice(0, 3) : []
                }
            })),
            then: {
                alwaysTrigger: true,
                gameAction: ability.actions.rearrangeCards((context) => ({
                    target: context.player.opponent,
                    amount: 2
                }))
            }
        });
    }
}

Vandalize.id = 'vandalize';

module.exports = Vandalize;
