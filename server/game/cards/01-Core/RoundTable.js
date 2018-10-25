const Card = require('../../Card.js');

class RoundTable extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.hasTrait('knight'),
            effect: [
                ability.effects.modifyPower(1),
                ability.effects.addKeyword({ taunt: 1 })
            ]
        })
    }
}

RoundTable.id = 'round-table'; // This is a guess at what the id might be - please check it!!!

module.exports = RoundTable;
