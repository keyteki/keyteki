const Card = require('../../Card.js');

class Daughter extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyHandSize(1)
        });
    }
}

Daughter.id = 'daughter';

module.exports = Daughter;
