const DrawCard = require('../../drawcard.js');

class PitTrap extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.doesNotReady()
        });
    }

    canPlayOn(card) {
        return card.isAttacking() && super.canPlayOn();
    }
}

PitTrap.id = 'pit-trap';

module.exports = PitTrap;
