const Card = require('../../Card.js');

class RoundTable extends Card {
    // Each friendly Knight creature gets +1 power and gains taunt.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasTrait('knight'),
            effect: [ability.effects.modifyPower(1), ability.effects.addKeyword({ taunt: 1 })]
        });
    }
}

RoundTable.id = 'round-table';

module.exports = RoundTable;
