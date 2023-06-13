const Card = require('../../Card.js');

class Impspector extends Card {
    // Destroyed: Your opponent purges a random card from their hand.
    setupCardAbilities(ability) {
        this.destroyed({
            optional: false,
            gameAction: ability.actions.purgeAtRandom()
        });
    }
}

Impspector.id = 'impspector';

module.exports = Impspector;
