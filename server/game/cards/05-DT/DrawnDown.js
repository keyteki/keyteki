const Card = require('../../Card.js');

class DrawnDown extends Card {
    //Play: Look at the top 3 cards of your opponent's deck. Discard one, put one on the bottom, and put one on the top.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
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

DrawnDown.id = 'drawn-down';

module.exports = DrawnDown;
