const DrawCard = require('../../drawcard.js');

class Sashimono extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.game.isDuringConflict('military'),
            effect: ability.effects.doesNotBow()
        });
    }

    canAttach(card, context) {
        if(!card.hasTrait('bushi')) {
            return false;
        }

        return super.canAttach(card, context);
    }
}

Sashimono.id = 'sashimono';

module.exports = Sashimono;
