const Card = require('../../Card.js');

class DrWesting extends Card {
    // After Reap: If Dr. Westing is on a flank, make a token creature.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.source.isOnFlank(),
            gameAction: ability.actions.makeTokenCreature()
        });
    }
}

DrWesting.id = 'dr-westing';

module.exports = DrWesting;
