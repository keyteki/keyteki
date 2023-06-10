const Card = require('../../Card.js');

class WayOfTheBear extends Card {
    // This creature gains assault 2. (Before this creature attacks, deal 2<D> to the attacked enemy.)
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword({ assault: 2 })
        });
    }
}

WayOfTheBear.id = 'way-of-the-bear';

module.exports = WayOfTheBear;
