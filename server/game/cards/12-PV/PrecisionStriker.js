import Card from '../../Card.js';

class PrecisionStriker extends Card {
    // Play/After Fight/After Reap: Discard the top 3 cards of your opponent's deck. Put 1 of the discarded cards on the bottom of your opponent's deck.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.deck.slice(0, 3)
            })),
            then: {
                target: {
                    controller: 'opponent',
                    location: 'discard',
                    cardCondition: (card, context) =>
                        context.preThenEvents
                            .filter((e) => !!e.card)
                            .map((e) => e.card)
                            .includes(card),
                    gameAction: ability.actions.returnToDeck({ bottom: true })
                },
                message: "{0} uses {1} to put {3} on the bottom of {4}'s deck",
                messageArgs: (context) => [context.target, context.player.opponent]
            }
        });
    }
}

PrecisionStriker.id = 'precision-striker';

export default PrecisionStriker;
