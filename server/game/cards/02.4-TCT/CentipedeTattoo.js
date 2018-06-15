const DrawCard = require('../../drawcard.js');

class CentipedeTattoo extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('tattooed')
        });
        this.whileAttached({
            condition: () => this.parent.isParticipating() && this.game.currentConflict.loser === this.parent.controller,
            effect: ability.effects.doesNotBow()
        });
    }

    canAttach(card, context) {
        if(card.hasTrait('monk')) {
            return super.canAttach(card, context);
        }
        return false;
    }
}

CentipedeTattoo.id = 'centipede-tattoo';

module.exports = CentipedeTattoo;
