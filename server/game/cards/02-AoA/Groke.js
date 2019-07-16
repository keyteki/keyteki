const Card = require('../../Card.js');

class Groke extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.loseAmber()
        });
    }
}

Groke.id = 'groke';

module.exports = Groke;
