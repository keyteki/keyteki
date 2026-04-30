const Card = require('../../Card.js');

class SandInYourEye extends Card {
    // Play: Exhaust a creature. Draw a card for each exhausted creature. Destroy each exhausted creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                gameAction: [
                    ability.actions.draw((context) => ({
                        amount: context.game.creaturesInPlay.filter((card) => card.exhausted).length
                    })),
                    ability.actions.destroy((context) => ({
                        target: context.game.creaturesInPlay.filter((card) => card.exhausted)
                    }))
                ]
            }
        });
    }
}

SandInYourEye.id = 'sand-in-your-eye';

module.exports = SandInYourEye;
