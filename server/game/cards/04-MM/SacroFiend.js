const Card = require('../../Card.js');

class SacroFiend extends Card {
    // Destroyed: Steal 1A.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.steal({ amount: 1 })
        });
    }
}

SacroFiend.id = 'sacro-fiend';

module.exports = SacroFiend;
