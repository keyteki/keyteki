const Card = require('../../Card.js');

class ProtectTheWeak extends Card {
    // This creature gets +1armor and gains taunt. (This creatures neighbors cannot be attacked unless they have taunt.)
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyArmor(1), ability.effects.addKeyword({ taunt: 1 })]
        });
    }
}

ProtectTheWeak.id = 'protect-the-weak';

module.exports = ProtectTheWeak;
