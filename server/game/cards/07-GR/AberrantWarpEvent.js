const Card = require('../../Card.js');

function discard(deck) {
    const index = deck.findIndex((card) => card.type === 'creature');
    if (index > -1) {
        return { target: deck.slice(0, index + 1) };
    }

    return { target: deck };
}

class AberrantWarpEvent extends Card {
    // Play: Discard cards from the top of your deck until you discard a
    // creature or run out of cards. If you discard a creature this way, put it
    // into play and destroy one of its neighbors. Repeat the preceding effect
    // on your opponent.
    setupCardAbilities(ability) {
        this.play({
            // Self discard
            gameAction: ability.actions.discard((context) => discard(context.player.deck)),
            then: (context) => {
                // Self play
                const card = context.player.deck.find((card) => card.type === 'creature');
                if (card) {
                    context.selfCreature = card;
                    return {
                        alwaysTriggers: true,
                        message: '{0} uses {1} to put {3} into play',
                        messageArgs: card,
                        gameAction: ability.actions.putIntoPlay({
                            target: card
                        }),
                        then: () => ({
                            // Self destroy
                            alwaysTriggers: true,
                            message: '{0} uses {1} to destroy the neighboring creature',
                            gameAction: ability.actions.destroy(() => ({
                                target: card.controller.creaturesInPlay.filter((card) =>
                                    card.neighbors.includes(context.selfCreature)
                                )
                            })),

                            // Opponent discard
                            then: () => ({
                                gameAction: ability.actions.discard((context) =>
                                    discard(context.player.opponent.deck)
                                ),
                                then: (context) => {
                                    // Opponent play
                                    const card = context.player.opponent.deck.find(
                                        (card) => card.type === 'creature'
                                    );
                                    if (card) {
                                        context.oppCreature = card;
                                        return {
                                            alwaysTriggers: true,
                                            message: '{0} uses {1} to put {3} into play',
                                            messageArgs: card,
                                            gameAction: ability.actions.putIntoPlay({
                                                target: card
                                            }),
                                            then: () => ({
                                                // Opponent destroy
                                                alwaysTriggers: true,
                                                message:
                                                    '{0} uses {1} to destroy the neighboring creature',
                                                gameAction: ability.actions.destroy(() => ({
                                                    target: card.controller.creaturesInPlay.filter(
                                                        (card) =>
                                                            card.neighbors.includes(
                                                                context.oppCreature
                                                            )
                                                    )
                                                }))
                                            })
                                        };
                                    }
                                }
                            })
                        })
                    };
                } else {
                    return {
                        // Opponent discard
                        alwaysTriggers: true,
                        message:
                            "{0} uses {1} to discard cards from the top of their opponent's deck",
                        gameAction: ability.actions.discard((context) =>
                            discard(context.player.opponent.deck)
                        ),
                        then: (context) => {
                            // Opponent play
                            const card = context.player.opponent.deck.find(
                                (card) => card.type === 'creature'
                            );
                            if (card) {
                                context.oppCreature = card;
                                return {
                                    alwaysTriggers: true,
                                    message: '{0} uses {1} to put {3} into play',
                                    messageArgs: card,
                                    gameAction: ability.actions.putIntoPlay({
                                        target: card
                                    }),
                                    then: () => ({
                                        // Opponent destroy
                                        alwaysTriggers: true,
                                        message: '{0} uses {1} to destroy the neighboring creature',
                                        gameAction: ability.actions.destroy(() => ({
                                            target: card.controller.creaturesInPlay.filter((card) =>
                                                card.neighbors.includes(context.oppCreature)
                                            )
                                        }))
                                    })
                                };
                            }
                        }
                    };
                }
            }
        });
    }
}

AberrantWarpEvent.id = 'aberrant-warp-event';

module.exports = AberrantWarpEvent;
