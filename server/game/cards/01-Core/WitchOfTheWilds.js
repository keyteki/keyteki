const Card = require('../../Card.js');

class WitchOfTheWilds extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.activeHouse !== 'untamed',
            effect: ability.effects.canPlayHouse('untamed')
        });
    }
}

WitchOfTheWilds.id = 'witch-of-the-wilds';

module.exports = WitchOfTheWilds;
