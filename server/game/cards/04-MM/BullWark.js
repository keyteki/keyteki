const Card = require('../../Card.js');

class BullWark extends Card {
    // Assault 2. (Before this creature attacks, deal 2 to the attacked enemy.)
    // Each of Bull-wark's neighbors gains assault 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.addKeyword({ assault: 2 })
        });
    }
}

BullWark.id = 'bull-wark';

module.exports = BullWark;
