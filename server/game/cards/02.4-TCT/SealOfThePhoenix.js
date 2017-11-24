const DrawCard = require('../../drawcard.js');

class SealOfThePhoenix extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.whileAttached({
            effect: [
                ability.effects.addFaction('phoenix'),
                ability.effects.addTrait('scholar')
            ]
        });
    }
}

SealOfThePhoenix.id = 'seal-of-the-phoenix';

module.exports = SealOfThePhoenix;
