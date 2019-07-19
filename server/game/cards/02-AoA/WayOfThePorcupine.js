const Card = require('../../Card.js');

class WayOfThePorcupine extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword({ hazardous: 3 })
        });
    }
}

WayOfThePorcupine.id = 'way-of-the-porcupine';

module.exports = WayOfThePorcupine;