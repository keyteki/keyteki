const DrawCard = require('../../drawcard.js');

class SealOfTheDragon extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('dragon'),
                ability.effects.addTrait('monk')
            ]
        });
    }
}

SealOfTheDragon.id = 'seal-of-the-dragon';

module.exports = SealOfTheDragon;
