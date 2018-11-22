const Card = require('../../Card.js');

class Dodger extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

Dodger.id = 'dodger'; // This is a guess at what the id might be - please check it!!!

module.exports = Dodger;
