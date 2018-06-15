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

    canPlayOn(card) {
        return card.isAttacking() && super.canPlayOn();
    }
}

PitTrap.id = 'pit-trap';

module.exports = PitTrap;
