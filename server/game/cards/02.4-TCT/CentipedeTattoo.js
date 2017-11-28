const DrawCard = require('../../drawcard.js');

class CentipedeTattoo extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('tattooed')
        });
        this.whileAttached({
            // when: {
            //     afterConflict: event => event.conflict.isParticipating(this.parent) && event.conflict.loser === this.parent.controller
            // },
            condition: () => (
                this.game.currentConflict &&
                this.game.currentConflict.loser &&
                this.game.currentConflict.isParticipating(this.parent) &&
                this.game.currentConflict.loser === this.parent.controller
            ),
            effect: [
                ability.effects.doesNotBowAsAttacker(),
                ability.effects.doesNotBowAsDefender()
            ]
        });
    }

    canAttach(card) {
        if(card.hasTrait('monk')) {
            return super.canAttach(card);
        }
        return false;
    }
}

CentipedeTattoo.id = 'centipede-tattoo';

module.exports = CentipedeTattoo;
