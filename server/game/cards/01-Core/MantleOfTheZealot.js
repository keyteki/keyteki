const Card = require('../../Card.js');

class MantleOfTheZealot extends Card {
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
