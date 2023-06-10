const Card = require('../../Card.js');

class YxilxDominator extends Card {
    // Taunt.(This creatures neighbors cannot be attacked unless they have taunt.)
    // Yxilx Dominator enters play stunned.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayStunned()
        });
    }
}

YxilxDominator.id = 'yxilx-dominator';

module.exports = YxilxDominator;
