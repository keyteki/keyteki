const Card = require('../../Card.js');

class QuintrinoWarp extends Card {
    // Play: Choose a friendly creature and an enemy creature. Destroy
    // those creatures and each creature that shares a house with
    // either of them. Gain 1 chain.
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
                        Object.values(context.targets).some((target) =>
                            target.getHouses().some((house) => card.hasHouse(house))
                        ) && Object.values(context.targets).every((target) => target !== card)
                )
            })),
            effect: 'destroy {1} and gain 1 chain',
            effectArgs: (context) => [
                context.game.creaturesInPlay.filter(
                    (card) =>
                        (context.targets.friendly &&
                            context.targets.friendly
                                .getHouses()
                                .some((house) => card.hasHouse(house))) ||
                        (context.targets.enemy &&
                            context.targets.enemy.getHouses().some((house) => card.hasHouse(house)))
                )
            ],
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.gainChains({ amount: 1 })
            }
        });
    }
}

QuintrinoWarp.id = 'quintrino-warp';

module.exports = QuintrinoWarp;
