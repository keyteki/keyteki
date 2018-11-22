const Card = require('../../Card.js');

class MantleOfTheZealot extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('persistentEffect', {
                effect: ability.effects.canUse(card => card === this.parent)
            })
        });
    }
}

MantleOfTheZealot.id = 'mantle-of-the-zealot'; // This is a guess at what the id might be - please check it!!!

module.exports = MantleOfTheZealot;
