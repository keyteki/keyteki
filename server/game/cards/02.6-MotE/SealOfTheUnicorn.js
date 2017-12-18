const DrawCard = require('../../drawcard.js');

class SealOfTheUnicorn extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addFaction('unicorn'),
                ability.effects.addTrait('cavalry')
            ]
        });
    }
}

SealOfTheUnicorn.id = 'seal-of-the-unicorn';

module.exports = SealOfTheUnicorn;
