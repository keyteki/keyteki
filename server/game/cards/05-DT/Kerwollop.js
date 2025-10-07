import Card from '../../Card.js';

class Kerwollop extends Card {
    // Play: Deal 1D to each creature. Gain 1A for each creature destroyed this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.game.creaturesInPlay
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvents.filter(
                        (event) =>
                            event.destroyEvent &&
                            event.destroyEvent.destroyedByDamageDealt &&
                            event.destroyEvent.resolved
                    ).length
                })),
                message:
                    '{0} uses {1} to gain 1 amber for each creature destroyed this way ({3}), gaining a total of {4} amber',
                messageArgs: (context) => [
                    context.preThenEvents
                        .filter(
                            (event) =>
                                event.destroyEvent &&
                                event.destroyEvent.destroyedByDamageDealt &&
                                event.destroyEvent.resolved
                        )
                        .map((event) => event.card),
                    context.preThenEvents.filter(
                        (event) =>
                            event.destroyEvent &&
                            event.destroyEvent.destroyedByDamageDealt &&
                            event.destroyEvent.resolved
                    ).length
                ]
            }
        });
    }
}

Kerwollop.id = 'kerwollop';

export default Kerwollop;
