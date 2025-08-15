const Card = require('../../Card.js');

class PowerUp extends Card {
    // Play: Give a friendly creature two +1 power counters. If that creature is the most powerful creature, archive this card.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.addPowerCounter({ amount: 2 })
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: (context) =>
                    preThenContext.target.getPower() ===
                    Math.max(...context.game.creaturesInPlay.map((card) => card.power)),
                gameAction: ability.actions.archive((context) => ({
                    target: context.source
                })),
                message: '{0} uses {1} to archive {1}'
            })
        });
    }
}

PowerUp.id = 'power-up';

module.exports = PowerUp;
