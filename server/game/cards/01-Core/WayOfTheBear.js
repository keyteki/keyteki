const Card = require('../../Card.js');

class WayOfTheBear extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword({ assault: 2 })
        });
    }
}

WayOfTheBear.id = 'way-of-the-bear';

module.exports = WayOfTheBear;
