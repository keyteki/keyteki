const Card = require('../../Card.js');

class RogueOperation extends Card {
    // Play: Discard the top 2 cards of your deck. Steal 1 Aember for each house represented among the discarded cards.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(0, Math.min(context.player.deck.length, 2))
            })),
            then: {
                condition: (context) =>
                    context.preThenEvents &&
                    context.preThenEvents
                        .map((event) => event.card)
                        .filter((card) => card.location === 'discard').length > 0,

                gameAction: ability.actions.steal((context) => ({
                    amount: context.game.getHousesInPlay(
                        context.preThenEvents
                            .map((event) => event.card)
                            .filter((card) => card.location === 'discard')
                    ).length
                }))
            }
        });
    }
}

RogueOperation.id = 'rogue-operation';

module.exports = RogueOperation;
