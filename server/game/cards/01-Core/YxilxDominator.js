const Card = require('../../Card.js');

class YxilxDominator extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayStunned()
        });
    }
}

YxilxDominator.id = 'yxilx-dominator';

module.exports = YxilxDominator;
