const DrawCard = require('../../drawcard.js');

class SealOfTheCrane extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('crane'),
                ability.effects.addTrait('duelist')
            ]
        });
    }
}

SealOfTheCrane.id = 'seal-of-the-crane';

module.exports = SealOfTheCrane;
