const DrawCard = require('../../drawcard.js');

class TheStoneOfSorrows extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.parent && !this.parent.bowed,
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.playerCannotTakeFateFromRings()
        });
    }
}

TheStoneOfSorrows.id = 'the-stone-of-sorrows';

module.exports = TheStoneOfSorrows;
