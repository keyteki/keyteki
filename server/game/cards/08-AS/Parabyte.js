const Card = require('../../Card.js');

class Parabyte extends Card {
    // Your opponent’s keys cost +1A for each A on friendly creatures.
    // Play/After Reap: A friendly creature captures 1A.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            }
        });
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost((player, context) =>
                context.source.controller.creaturesInPlay.reduce(
                    (total, card) => total + card.amber,
                    0
                )
            )
        });
    }
}

Parabyte.id = 'parabyte';

module.exports = Parabyte;
