const Card = require('../../Card.js');

class Bloodwing extends Card {
    // Enhance capture power power.
    // After Fight/After Reap: Put a +1 power counter on each friendly flank creature.
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            gameAction: ability.actions.addPowerCounter((context) => ({
                target: context.player.creaturesInPlay.filter((card) => card.isOnFlank())
            }))
        });
    }
}

Bloodwing.id = 'bloodwing';

module.exports = Bloodwing;
