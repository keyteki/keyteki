const Card = require('../../Card.js');

class LongusaurLector extends Card {
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                gameAction: ability.actions.makeTokenCreature(),
                message: '{0} uses {1} to make a token creature'
            }
        });
    }
}

LongusaurLector.id = 'longusaur-lector';

module.exports = LongusaurLector;
