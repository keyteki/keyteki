const Card = require('../../Card.js');

class D1V3 extends Card {
    //While the tide is high, this creature gains skirmish.
    //While the tide is low, this creature gains elusive.
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: (context) => context.player.isTideHigh(),
            effect: ability.effects.addKeyword({ skirmish: 1 })
        });

        this.whileAttached({
            condition: (context) => context.player.isTideLow(),
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

D1V3.id = 'd1-v3';

module.exports = D1V3;
