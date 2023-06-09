const Card = require('../../Card.js');

class Gub extends Card {
    // While Gub is not on a flank, it gets +5power and gains taunt.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.isOnFlank(),
            effect: [ability.effects.modifyPower(5), ability.effects.addKeyword({ taunt: 1 })]
        });
    }
}

Gub.id = 'gub';

module.exports = Gub;
