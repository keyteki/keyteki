const Card = require('../../Card.js');

class Impspector extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            optional: false,
            gameAction: ability.actions.purgeAtRandom()
        });
    }
}

Impspector.id = 'impspector';

module.exports = Impspector;
