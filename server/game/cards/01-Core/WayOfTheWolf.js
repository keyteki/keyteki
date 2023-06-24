const Card = require('../../Card.js');

class WayOfTheWolf extends Card {
    // This creature gains skirmish.  (When you use this creature to fight, it is dealt no damage in return.)
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });
    }
}

WayOfTheWolf.id = 'way-of-the-wolf';

module.exports = WayOfTheWolf;
