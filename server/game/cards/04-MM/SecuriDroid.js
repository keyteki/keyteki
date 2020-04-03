const Card = require('../../Card.js');

class SecuriDroid extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            location: 'any',
            effect: ability.effects.canPlayAsUpgrade()
        });
        this.whileAttached({
            effect: ability.effects.addKeyword({ Taunt: 1 })
        });
    }
}

SecuriDroid.id = 'securi-droid';

module.exports = SecuriDroid;
