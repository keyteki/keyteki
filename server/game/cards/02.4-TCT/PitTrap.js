const DrawCard = require('../../drawcard.js');

class PitTrap extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => (
                this.game.currentPhase === 'regroup'
            ),
            effect: ability.effects.cannotBeReadied()
        });
    }

    canAttach(card) {
        if(this.game.currentConflict && this.game.currentConflict.isAttacking(card)) {
            return super.canAttach(card);
        }
        return false;
    }
}

PitTrap.id = 'pit-trap';

module.exports = PitTrap;
