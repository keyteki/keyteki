const Card = require('../../Card.js');

class ScalawagFinn extends Card {
    // After Fight: Scalawag Finn heals 3 damage.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.heal({ amount: 3 })
        });
    }
}

ScalawagFinn.id = 'scalawag-finn';

module.exports = ScalawagFinn;
