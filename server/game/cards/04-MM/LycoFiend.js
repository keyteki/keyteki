const Card = require('../../Card.js');

class LycoFiend extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // Destroyed: Steal 1A.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.steal({ amount: 1 })
        });
    }
}

LycoFiend.id = 'lyco-fiend';

module.exports = LycoFiend;
