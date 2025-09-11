const Card = require('../../Card.js');

class BoschTheUnyielding extends Card {
    // After Fight: Fully heal Bosch the Unyielding.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.heal({ fully: true })
        });
    }
}

BoschTheUnyielding.id = 'bosch-the-unyielding';

module.exports = BoschTheUnyielding;
