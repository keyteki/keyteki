import Card from '../../Card.js';

class IntoTheWarp extends Card {
    // Play: Each player discards the top card of their deck. Destroy
    // each creature that shares a house with at least one of the
    // discarded cards.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.deck.length > 0 ||
                (!!context.player.opponent && context.player.opponent.deck.length > 0),
            gameAction: [
                ability.actions.conditional({
                    condition: (context) => context.player.deck.length > 0,
                    trueGameAction: ability.actions.discard((context) => ({
                        target: context.player.deck[0]
                    }))
                }),
                ability.actions.conditional({
                    condition: (context) =>
                        !!context.player.opponent && context.player.opponent.deck.length > 0,
                    trueGameAction: ability.actions.discard((context) => ({
                        target: context.player.opponent
                            ? context.player.opponent.deck[0]
                            : undefined
                    }))
                })
            ],
            message: "{0} uses {1} to discard the top card of each player's deck",
            messageArgs: (context) => [context.player, context.source],
            then: {
                gameAction: ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter((c) =>
                        context.preThenEvents
                            .filter((e) => e.name === 'onCardDiscarded')
                            .map((e) => e.card.printedHouse)
                            .some((h) => c.hasHouse(h))
                    )
                })),
                message: '{0} uses {1} to discard {3} and destroy {4}',
                messageArgs: (context) => [
                    context.preThenEvents.map((e) => e.card.name),
                    context.game.creaturesInPlay.filter((c) =>
                        context.preThenEvents
                            .filter((e) => e.name === 'onCardDiscarded')
                            .map((e) => e.card.printedHouse)
                            .some((h) => c.hasHouse(h))
                    )
                ]
            }
        });
    }
}

IntoTheWarp.id = 'into-the-warp';

export default IntoTheWarp;
