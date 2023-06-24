const Card = require('../../Card.js');

class Paraguardian extends Card {
    // Reap: You may exalt Paraguardian. If you do, ward each of its neighbors.
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            effect: 'exalt {0} and ward its neighbors',
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.ward((context) => ({
                    target: context.source.neighbors
                }))
            }
        });
    }
}

Paraguardian.id = 'paraguardian';

module.exports = Paraguardian;
