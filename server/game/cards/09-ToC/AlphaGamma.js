const Card = require('../../Card.js');

class AlphaGamma extends Card {
    // Destroyed: Archive Alpha-Gamma.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.archive()
        });
    }
}

AlphaGamma.id = 'alpha-gamma';

module.exports = AlphaGamma;
