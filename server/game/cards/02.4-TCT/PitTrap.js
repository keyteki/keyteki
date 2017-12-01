const DrawCard = require('../../drawcard.js');

class PitTrap extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => (
                this.game.currentPhase === 'regroup'
            ),
            effect: ability.effects.doesNotReadyDuringRegroup()
        });
    }

    canPlay(card) {
        return card.isAttacking() && super.canPlay();
    }
}

PitTrap.id = 'pit-trap';

module.exports = PitTrap;
