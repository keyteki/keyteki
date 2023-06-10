const Card = require('../../Card.js');

class Hecatomb extends Card {
    // Play: Destroy each Dis creature. Each player gains 1A for each creature they controlled that was destroyed this way.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'destroy {1} and make each player gain 1 amber for each controlled creature that was destroyed this way',
            effectArgs: (context) => [
                context.game.creaturesInPlay.filter((card) => card.hasHouse('dis'))
            ],
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasHouse('dis'))
            })),
            then: {
                alwaysTriggers: true,
                gameAction: [
                    ability.actions.gainAmber((context) => ({
                        amount: context.preThenEvents.filter(
                            (event) => !event.cancelled && event.clone.controller == context.player
                        ).length
                    })),
                    ability.actions.gainAmber((context) => ({
                        target: context.player.opponent,
                        amount: context.preThenEvents.filter(
                            (event) =>
                                !event.cancelled &&
                                event.clone.controller == context.player.opponent
                        ).length
                    }))
                ]
            }
        });
    }
}

Hecatomb.id = 'hecatomb';

module.exports = Hecatomb;
