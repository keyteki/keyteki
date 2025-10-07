import Card from '../../Card.js';

class MassBuyout extends Card {
    // Play: Destroy each creature. Each player gains Aember icon
    // equal to half the number of creatures they controlled that were
    // destroyed this way (rounded up).
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay
            })),
            then: {
                alwaysTriggers: true,
                gameAction: [
                    ability.actions.gainAmber((context) => ({
                        target: context.player,
                        amount: Math.ceil(
                            context.preThenEvents.filter(
                                (event) =>
                                    !event.cancelled && event.clone.controller === context.player
                            ).length * 0.5
                        )
                    })),
                    ability.actions.gainAmber((context) => ({
                        target: context.player.opponent,
                        amount: Math.ceil(
                            context.preThenEvents.filter(
                                (event) =>
                                    !event.cancelled &&
                                    event.clone.controller === context.player.opponent
                            ).length * 0.5
                        )
                    }))
                ],
                message: '{0} uses {1} to gain {3} amber, and {4} gains {5} amber',
                messageArgs: (context) => [
                    Math.ceil(
                        context.preThenEvents.filter(
                            (event) => !event.cancelled && event.clone.controller === context.player
                        ).length * 0.5
                    ),
                    context.player.opponent,
                    Math.ceil(
                        context.preThenEvents.filter(
                            (event) =>
                                !event.cancelled &&
                                event.clone.controller === context.player.opponent
                        ).length * 0.5
                    )
                ]
            }
        });
    }
}

MassBuyout.id = 'mass-buyout';

export default MassBuyout;
