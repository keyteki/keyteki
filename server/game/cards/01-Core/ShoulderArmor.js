const Card = require('../../Card.js');

class ShoulderArmor extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            match: (card) => card.isOnFlank(),
            effect: [ability.effects.modifyPower(2), ability.effects.modifyArmor(2)]
        });
    }
}

ShoulderArmor.id = 'shoulder-armor';

module.exports = ShoulderArmor;
