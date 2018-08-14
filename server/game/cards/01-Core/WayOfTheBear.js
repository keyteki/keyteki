const Card = require('../../Card.js');

class WayOfTheBear extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword({ assault: 2 })
        });
    }
}

WayOfTheBear.id = 'way-of-the-bear'; // This is a guess at what the id might be - please check it!!!

module.exports = WayOfTheBear;
