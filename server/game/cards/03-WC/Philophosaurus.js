const Card = require('../../Card.js');

class Philophosaurus extends Card {
    // Reap: You may look at the top 3 cards of your deck. Archive 1, add 1 to your hand, and discard 1.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.deck.length > 0,
            optional: true,
            effect: 'archive 1 card, move 1 card to hand and discard 1 card',
            gameAction: ability.actions.archive((context) => ({
                promptWithHandlerMenu: {
                    activePromptTitle: 'Choose which card to archive',
                    cards: context.player.deck.slice(0, 3)
                }
            })),
            then: {
                condition: (context) => context.player.deck.length > 0,
                gameAction: ability.actions.moveCard((context) => ({
                    destination: 'hand',
                    promptWithHandlerMenu: {
                        activePromptTitle: 'Choose a card to add to hand',
                        cards: context.player.deck.slice(0, 2)
                    }
                })),
                then: {
                    condition: (context) => context.player.deck.length > 0,
                    gameAction: ability.actions.discard((context) => ({
                        target: context.player.deck[0]
                    }))
                }
            }
        });
    }
}

Philophosaurus.id = 'philophosaurus';

module.exports = Philophosaurus;
