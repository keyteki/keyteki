const Card = require('../../Card.js');

class MedicusLacus extends Card {
    // (T) While the tide is high, you may spend A on friendly creatures as if it were in your pool.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.isTideHigh(),
            match: (card) => card.type === 'creature',
            effect: ability.effects.forgeAmberSource('controller', 'onCard')
        });
    }
}

MedicusLacus.id = 'medicus-lacus';

module.exports = MedicusLacus;
