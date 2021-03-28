const Card = require('../../Card.js');

class DaemoBeast extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.steal({ amount: 1 })
        });
    }
}

DaemoBeast.id = 'dæmo-beast';

module.exports = DaemoBeast;
