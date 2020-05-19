const Card = require('../../Card.js');

class BullWark extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => this.neighbors.includes(card),
            effect: ability.effects.addKeyword({ assault: 2 })
        });
    }
}

BullWark.id = 'bull-wark';

module.exports = BullWark;
