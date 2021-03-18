const Card = require('../../Card.js');

class ShieldULater extends Card {
    //This creature may be played as an upgrade instead of a creature, with the text: “This creature gains +2 armor”.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canPlayAsUpgrade()
        });

        this.whileAttached({
            effect: ability.effects.modifyArmor(2)
        });
    }
}

ShieldULater.id = 'shield-u-later';

module.exports = ShieldULater;
