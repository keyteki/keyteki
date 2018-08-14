const Card = require('../../Card.js');

class PitDemon extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal()
        });
    }
}

PitDemon.id = 'pit-demon'; // This is a guess at what the id might be - please check it!!!

module.exports = PitDemon;
