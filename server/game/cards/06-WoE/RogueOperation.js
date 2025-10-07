import Card from '../../Card.js';

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
                })),
                message: '{0} uses {1} to steal {3} amber from {4}',
                messageArgs: (context) => [
                    context.game.getHousesInPlay(
                        context.preThenEvents
                            .map((event) => event.card)
                            .filter((card) => card.location === 'discard')
                    ).length,
                    context.player.opponent
                ]
            }
        });
    }
}

RogueOperation.id = 'rogue-operation';

export default RogueOperation;
