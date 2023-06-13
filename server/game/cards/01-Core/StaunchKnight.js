const Card = require('../../Card.js');

class StaunchKnight extends Card {
    // Staunch Knight gets +2 power while it is on a flank.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isOnFlank(),
            effect: ability.effects.modifyPower(2)
        });
    }
}

StaunchKnight.id = 'staunch-knight';

module.exports = StaunchKnight;
