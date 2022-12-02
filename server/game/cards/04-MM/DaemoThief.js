const Card = require('../../Card.js');

class DaemoThief extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.steal({ amount: 1 })
        });
    }
}

DaemoThief.id = 'dæmo-thief';

module.exports = DaemoThief;
