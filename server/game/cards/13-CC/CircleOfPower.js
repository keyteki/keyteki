const Card = require('../../Card.js');

class CircleOfPower extends Card {
    // Each friendly Untamed creature is considered to have 5 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.hasHouse('untamed'),
            effect: ability.effects.setPower(5)
        });
    }
}

CircleOfPower.id = 'circle-of-power';

module.exports = CircleOfPower;
