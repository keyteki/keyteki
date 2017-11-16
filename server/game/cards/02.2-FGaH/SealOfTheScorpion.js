const DrawCard = require('../../drawcard.js');

class SealOfTheScorpion extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('scorpion'),
                ability.effects.addTrait('shinobi')
            ]
        });
    }
}

SealOfTheScorpion.id = 'seal-of-the-scorpion';

module.exports = SealOfTheScorpion;
