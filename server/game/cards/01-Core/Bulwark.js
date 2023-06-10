const Card = require('../../Card.js');

class Bulwark extends Card {
    // Each of Bulwarks neighbors gets +2 armor.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) => context.source.neighbors.includes(card),
            effect: ability.effects.modifyArmor(2)
        });
    }
}

Bulwark.id = 'bulwark';

module.exports = Bulwark;
