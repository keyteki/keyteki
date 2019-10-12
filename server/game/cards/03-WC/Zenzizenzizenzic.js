const Card = require('../../Card.js');

class Zenzizenzizenzic extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isInCenter(),
            effect: ability.effects.modifyHandSize(2)
        });
    }
}

Zenzizenzizenzic.id = 'zenzizenzizenzic';

module.exports = Zenzizenzizenzic;
