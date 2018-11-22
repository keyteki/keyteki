const Card = require('../../Card.js');

class WitchOfTheWilds extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.canPlayHouse('untamed')
        });
    }
}

WitchOfTheWilds.id = 'witch-of-the-wilds'; // This is a guess at what the id might be - please check it!!!

module.exports = WitchOfTheWilds;
