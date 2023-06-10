const Card = require('../../Card.js');

class WitchOfTheWilds extends Card {
    // During each turn in which Untamed is not your active house, you may play one Untamed card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.activeHouse !== 'untamed',
            effect: ability.effects.canPlayHouse('untamed')
        });
    }
}

WitchOfTheWilds.id = 'witch-of-the-wilds';

module.exports = WitchOfTheWilds;
