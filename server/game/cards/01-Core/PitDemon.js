const Card = require('../../Card.js');

class PitDemon extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal()
        });
    }
}

PitDemon.id = 'pit-demon';

module.exports = PitDemon;
