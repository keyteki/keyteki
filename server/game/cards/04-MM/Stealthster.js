const Card = require('../../Card.js');

class Stealthster extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Stealthster may be played as an upgrade instead of a creature, with the text: This creature gains elusive.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canPlayAsUpgrade()
        });

        this.whileAttached({
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

Stealthster.id = 'stealthster';

module.exports = Stealthster;
