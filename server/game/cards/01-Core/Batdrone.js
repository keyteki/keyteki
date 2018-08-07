const Card = require('../../Card.js');

class Batdrone extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

Batdrone.id = 'batdrone'; // This is a guess at what the id might be - please check it!!!

module.exports = Batdrone;
