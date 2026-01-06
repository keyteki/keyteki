const Card = require('../../Card.js');

class CrimsonChurning extends Card {
    // Play: For each friendly Tentacle in play, deal 1 to an enemy creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.allocateDamage((context) => ({
                numSteps: context.player.creaturesInPlay.filter((card) => card.hasTrait('tentacle'))
                    .length,
                controller: 'opponent'
            }))
        });
    }
}

CrimsonChurning.id = 'crimson-churning';

module.exports = CrimsonChurning;
