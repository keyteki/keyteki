const Card = require('../../Card.js');

class DameMargaret extends Card {
    // Deploy. Taunt.
    // Dame Margaret gets +2 armor for each key your opponent has forged.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyArmor((card) => {
                return card.controller.opponent ? card.controller.opponent.getForgedKeys() * 2 : 0;
            })
        });
    }
}

DameMargaret.id = 'dame-margaret';

module.exports = DameMargaret;
