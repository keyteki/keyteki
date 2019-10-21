const Card = require('../../Card.js');

class Mother extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyHandSize(1)
        });
    }
}

Mother.id = 'mother';

module.exports = Mother;
