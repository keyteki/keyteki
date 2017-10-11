const DrawCard = require('../../drawcard.js');

class Sashimono extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => (
                this.game.currentConflict &&
                this.game.currentConflict.conflictType === 'military'
            ),
            effect: [
                ability.effects.doesNotBowAsAttacker(),
                ability.effects.doesNotBowAsDefender()
            ]
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.hasTrait('bushi')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Sashimono.id = 'sashimono';

module.exports = Sashimono;
