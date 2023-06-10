const Card = require('../../Card.js');

class SecuriDroid extends Card {
    // Taunt. (This creatures neighbors cannot be attacked unless they have taunt.)
    // Securi-Droid may be played as an upgrade instead of a creature, with the text: This creature gains taunt.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canPlayAsUpgrade()
        });
        this.whileAttached({
            effect: ability.effects.addKeyword({ taunt: 1 })
        });
    }
}

SecuriDroid.id = 'securi-droid';

module.exports = SecuriDroid;
