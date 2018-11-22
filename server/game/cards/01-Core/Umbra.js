const Card = require('../../Card.js');

class Umbra extends Card {
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.steal()
        });
    }
}

Umbra.id = 'umbra'; // This is a guess at what the id might be - please check it!!!

module.exports = Umbra;
