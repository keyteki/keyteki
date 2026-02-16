const Card = require('../../Card.js');

class Amberling extends Card {
    // Æmberling cannot reap.
    //
    // You may spend Æmberling as if it were Aember icon in your
    // pool. (Discard it, ignoring wards.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('reap')
        });

        this.persistentEffect({
            effect: ability.effects.forgeAmberSource('controller', 'card')
        });
    }
}

Amberling.id = 'æmberling';

module.exports = Amberling;
