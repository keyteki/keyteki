const Card = require('../../Card.js');

class BloodOfTitans extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyPower(5)
        });
    }
}

BloodOfTitans.id = 'blood-of-titans'; // This is a guess at what the id might be - please check it!!!

module.exports = BloodOfTitans;
