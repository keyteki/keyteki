const Card = require('../../Card.js');

class DetentionCoil extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('fight')
        });
    }
}

DetentionCoil.id = 'detention-coil';

module.exports = DetentionCoil;
