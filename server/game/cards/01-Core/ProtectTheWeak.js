const Card = require('../../Card.js');

class ProtectTheWeak extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.modifyArmor(1),
                ability.effects.addKeyword({ taunt: 1 })
            ]
        });
    }
}

ProtectTheWeak.id = 'protect-the-weak'; // This is a guess at what the id might be - please check it!!!

module.exports = ProtectTheWeak;
