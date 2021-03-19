const Card = require('../../Card.js');

class UnderPressure extends Card {
    //This creature cannot ready.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('ready')
        });
    }
}

UnderPressure.id = 'under-pressure';

module.exports = UnderPressure;
