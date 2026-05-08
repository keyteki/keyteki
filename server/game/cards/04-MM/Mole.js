const Card = require('../../Card.js');

class Mole extends Card {
    // This creature gains, "Your opponent may spend on this creature as if it were in their pool."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.forgeAmberSource('opponent', 'onCard')
        });
    }
}

Mole.id = 'mole';

module.exports = Mole;
