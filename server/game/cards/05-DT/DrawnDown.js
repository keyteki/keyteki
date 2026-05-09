const Card = require('../../Card.js');

class DrawnDown extends Card {
    // Play: Look at the top 3 cards of your opponent's deck. Discard 1, put 1 on the bottom of their deck, and put 1 on top of their deck.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: "look at the top {2} card{3} of {1}'s deck",
            effectArgs: (context) => {
                const count = Math.min(3, context.player.opponent.deck.length);
                return [context.player.opponent, count, count === 1 ? '' : 's'];
            },
            gameAction: ability.actions.sequential([
                ability.actions.conditional({
                    // Only show the discard prompt if there is at least 1 card in the opponent's deck
                    condition: (context) => context.player.opponent.deck.length >= 1,
                    trueGameAction: ability.actions.discard((context) => ({
                        promptWithHandlerMenu: {
                            activePromptTitle: 'Choose a card to discard',
                            cards: context.player.opponent.deck.slice(0, 3)
                        }
                    }))
                }),
                ability.actions.conditional({
                    // Only show the move to bottom prompt if there were at least 2 cards in the opponent's deck (1 was already discarded and 1 to move to bottom so condition on 1)
                    condition: (context) => context.player.opponent.deck.length >= 1,
                    trueGameAction: ability.actions.moveToBottom((context) => ({
                        promptWithHandlerMenu: {
                            activePromptTitle: 'Choose a card to put on bottom of deck',
                            cards: context.player.opponent.deck.slice(0, 2),
                            message: "{0} uses {1} to put a card on the bottom of {3}'s deck",
                            messageArgs: [context.player.opponent]
                        }
                    }))
                })
            ]),
            then: {
                // If there were at least 3 cards in the opponent's deck (1 was already discard, and another put on the bottom, so condition on 2), show a message that the remaining card was automatically put back on top
                alwaysTriggers: true,
                condition: (context) => context.player.opponent.deck.length >= 2,
                message: "{0} uses {1} to put a card on top of {3}'s deck",
                messageArgs: (context) => [context.player.opponent]
            }
        });
    }
}

DrawnDown.id = 'drawn-down';

module.exports = DrawnDown;
