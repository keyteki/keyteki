const Card = require('../../Card.js');

class Stooge extends Card {
    // Action: If Stooge is on a flank, make a token creature.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => context.source.isOnFlank(),
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

Stooge.id = 'stooge';

module.exports = Stooge;
