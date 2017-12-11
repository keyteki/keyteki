const DrawCard = require('../../drawcard.js');

class StoneOfSorrows extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.parent && !this.parent.bowed,
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.playerCannotTakeFateFromRings()
        });
    }
}

StoneOfSorrows.id = 'stone-of-sorrows'; // This is a guess at what the id might be - please check it!!!

module.exports = StoneOfSorrows;
