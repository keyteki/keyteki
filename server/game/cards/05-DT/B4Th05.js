const Card = require('../../Card.js');

class B4Th05 extends Card {
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

B4Th05.id = 'b4-th05';

module.exports = B4Th05;
