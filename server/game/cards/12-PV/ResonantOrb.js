import Card from '../../Card.js';

class ResonantOrb extends Card {
    // After Reap: Discard the top card of your deck. If it is a creature,
    // destroy an enemy creature and put the discarded card into play.
    // If you do, repeat the preceding effect.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck[0]
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.preThenEvents.length > 0 &&
                    context.preThenEvents[context.preThenEvents.length - 1].card &&
                    context.preThenEvents[context.preThenEvents.length - 1].card.type ===
                        'creature',
                target: {
                    cardType: 'creature',
                    controller: 'opponent'
                },
                message: '{0} uses {1} to destroy {3} and put {4} into play',
                messageArgs: (context) => [
                    context.target,
                    context.preThenEvents[context.preThenEvents.length - 1].card
                ],
                gameAction: ability.actions.sequential([
                    ability.actions.destroy((context) => ({
                        target: context.target
                    })),
                    ability.actions.putIntoPlay((context) => ({
                        target:
                            context.preThenEvents.length > 0
                                ? context.preThenEvents[context.preThenEvents.length - 1].card
                                : []
                    }))
                ]),
                then: {
                    condition: (context) => context.player.deck.length > 0,
                    gameAction: ability.actions.discard((context) => ({
                        target: context.player.deck[0]
                    })),
                    then: {
                        condition: (context) =>
                            context.preThenEvents.length > 0 &&
                            context.preThenEvents[context.preThenEvents.length - 1].card &&
                            context.preThenEvents[context.preThenEvents.length - 1].card.type ===
                                'creature',
                        target: {
                            cardType: 'creature',
                            controller: 'opponent'
                        },
                        message: '{0} uses {1} to destroy {3} and put {4} into play',
                        messageArgs: (context) => [
                            context.target,
                            context.preThenEvents[context.preThenEvents.length - 1].card
                        ],
                        gameAction: ability.actions.sequential([
                            ability.actions.destroy((context) => ({
                                target: context.target
                            })),
                            ability.actions.putIntoPlay((context) => ({
                                target:
                                    context.preThenEvents.length > 0
                                        ? context.preThenEvents[context.preThenEvents.length - 1]
                                              .card
                                        : []
                            }))
                        ])
                    }
                }
            }
        });
    }
}

ResonantOrb.id = 'resonant-orb';

export default ResonantOrb;
