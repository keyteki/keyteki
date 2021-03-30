const Card = require('../../Card.js');

class DrawnByTheDepths extends Card {
    //Play: Look at the top 3 cards of your opponent's deck. Discard one, put one on the bottom, and put one on the top.
    setupCardAbilities(ability) {
        this.play({
            effect: 'to look at the top 3 cards of their deck',
            gameAction: ability.actions.sequential([
                ability.actions.discard((context) => ({
                    promptWithHandlerMenu: {
                        activePromptTitle: 'Choose a card to add to discard',
                        cards: context.player.opponent.deck.slice(0, 3)
                    }
                })),
                ability.actions.moveToBottom((context) => ({
                    promptWithHandlerMenu: {
                        activePromptTitle: 'Choose a card to move to bottom of deck',
                        cards: context.player.opponent.deck.slice(0, 2),
                        message: '{0} adds a card to their hand and moves a card to bottom of deck'
                    }
                }))
            ])
        });
    }
}

//  Look at the top 3 cards of your deck. Put 1 into your hand and 1 on the bottom of your deck.

DrawnByTheDepths.id = 'drawn-by-the-depths';

module.exports = DrawnByTheDepths;
