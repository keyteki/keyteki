const Card = require('../../Card.js');

class ShoulderArmor extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            match: card => card.isOnFlank(),
            effect: [
                ability.effects.modifyPower(2),
                ability.effects.modifyArmor(2)
            ]
        });
    }
}

ShoulderArmor.id = 'shoulder-armor'; // This is a guess at what the id might be - please check it!!!

module.exports = ShoulderArmor;
