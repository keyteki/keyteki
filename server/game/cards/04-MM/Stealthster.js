const Card = require('../../Card.js');

class Stealthster extends Card {
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
