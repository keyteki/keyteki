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
                    condition: (context) => context.player.opponent.deck.length >= 1,
                    trueGameAction: ability.actions.discard((context) => {
                        const cards = context.player.opponent.deck.slice(0, 3);
                        return {
                            promptWithHandlerMenu: {
                                activePromptTitle: 'Choose a card to discard',
                                cards: cards
                            }
                        };
                    })
                }),
                ability.actions.conditional({
                    condition: (context) => context.player.opponent.deck.length >= 2,
                    trueGameAction: ability.actions.moveToBottom((context) => {
                        const cards = context.player.opponent.deck.slice(0, 2);
                        return {
                            promptWithHandlerMenu: {
                                activePromptTitle: 'Choose a card to put on bottom of deck',
                                cards: cards,
                                message: "{0} uses {1} to put a card on the bottom of {3}'s deck",
                                messageArgs: [context.player.opponent]
                            }
                        };
                    })
                })
            ]),
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.opponent.deck.length >= 3,
                message: "{0} uses {1} to put a card to the top of {3}'s deck",
                messageArgs: (context) => [context.player.opponent]
            }
        });
    }
}

DrawnDown.id = 'drawn-down';

module.exports = DrawnDown;
