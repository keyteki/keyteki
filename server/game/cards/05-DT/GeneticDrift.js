const Card = require('../../Card.js');

class GeneticDrift extends Card {
    setupCardAbilities(ability) {
        // Play: Give a creature a +1 power counter. Then give each creature with a +1 power counter another +1 power counter.
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.addPowerCounter()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.addPowerCounter((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => !!card.tokens.power)
                }))
            }
        });
    }
}

GeneticDrift.id = 'genetic-drift';

module.exports = GeneticDrift;
