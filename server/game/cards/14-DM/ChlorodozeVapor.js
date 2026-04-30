const Card = require('../../Card.js');

class ChlorodozeVapor extends Card {
    // Play: Deal 3 to each creature. For each creature destroyed this way, exhaust a creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 3,
                target: context.game.creaturesInPlay
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.preThenEvents.some(
                        (event) => event.destroyEvent && event.destroyEvent.destroyedByDamageDealt
                    ),
                target: {
                    mode: 'upTo',
                    numCards: (context) =>
                        context.preThenEvents.filter(
                            (event) =>
                                event.destroyEvent && event.destroyEvent.destroyedByDamageDealt
                        ).length,
                    cardType: 'creature',
                    controller: 'any',
                    gameAction: ability.actions.exhaust()
                },
                effect: 'exhaust {1}'
            }
        });
    }
}

ChlorodozeVapor.id = 'chlorodoze-vapor';

module.exports = ChlorodozeVapor;
