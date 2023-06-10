const Card = require('../../Card.js');

class MantleOfTheZealot extends Card {
    // This creature gains, You may use this creature as if it belonged to the active house.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                effect: ability.effects.canUse((card) => card === this.parent)
            })
        });
    }
}

MantleOfTheZealot.id = 'mantle-of-the-zealot';

module.exports = MantleOfTheZealot;
