const Card = require('../../Card.js');

class QuintrinoFlux extends Card {
    // Play: Choose a friendly creature and an enemy creature. Destroy the chosen creatures and each creature with the same power as either of the chosen creatures.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                friendly: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.destroy()
                },
                enemy: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.destroy()
                }
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) =>
                        Object.values(context.targets).some(
                            (target) => card.power === target.power
                        ) && Object.values(context.targets).every((target) => target !== card)
                )
            })),
            effect: 'destroy {1}',
            effectArgs: (context) => [
                context.game.creaturesInPlay.filter(
                    (card) =>
                        (context.targets.friendly &&
                            card.power === context.targets.friendly.power) ||
                        (context.targets.enemy && card.power === context.targets.enemy.power)
                )
            ]
        });
    }
}

QuintrinoFlux.id = 'quintrino-flux';

module.exports = QuintrinoFlux;
