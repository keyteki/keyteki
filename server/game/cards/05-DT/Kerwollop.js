const Card = require('../../Card.js');

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
                    '{0} uses {1} to gain 1 amber for each creature destroyed this way, gaining a total of {3} amber: {4}',
                messageArgs: (context) => [
                    context.preThenEvents.filter(
                        (event) =>
                            event.destroyEvent &&
                            event.destroyEvent.destroyedByDamageDealt &&
                            event.destroyEvent.resolved
                    ).length,
                    context.preThenEvents
                        .filter(
                            (event) =>
                                event.destroyEvent &&
                                event.destroyEvent.destroyedByDamageDealt &&
                                event.destroyEvent.resolved
                        )
                        .map((event) => event.card.name)
                ]
            }
        });
    }
}

Kerwollop.id = 'kerwollop';

module.exports = Kerwollop;
