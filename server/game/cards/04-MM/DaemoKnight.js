const Card = require('../../Card.js');

class DaemoKnight extends Card {
    // Destroyed: Steal 1A.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.steal({ amount: 1 })
        });
    }
}

DaemoKnight.id = 'dæmo-knight';

module.exports = DaemoKnight;
