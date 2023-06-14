const Card = require('../../Card.js');

class ShoulderArmor extends Card {
    // While this creature is on a flank, it gets +2 armor and +2 power.
    setupCardAbilities(ability) {
        this.whileAttached({
            match: (card) => card.isOnFlank(),
            effect: [ability.effects.modifyPower(2), ability.effects.modifyArmor(2)]
        });
    }
}

ShoulderArmor.id = 'shoulder-armor';

module.exports = ShoulderArmor;
