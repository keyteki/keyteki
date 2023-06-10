const Card = require('../../Card.js');

class WayOfThePorcupine extends Card {
    // This creature gains Hazardous3. (Before this creature is attacked, deal 3D to the attacking enemy.)
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword({ hazardous: 3 })
        });
    }
}

WayOfThePorcupine.id = 'way-of-the-porcupine';

module.exports = WayOfThePorcupine;
