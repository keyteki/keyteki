const DrawCard = require('../../drawcard.js');

class CentipedeTattoo extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('tattooed')
        });

        this.whileAttached({
            when: {
                afterConflict: event => event.conflict.loser === this.controller && event.conflict.isParticipating(this)
            },
            effect: [
                ability.effects.doesNotBowAsAttacker,
                ability.effects.doesNotBowAsDefender
            ]
        });
    }

    canAttach(card) {
        if(this.hasTrait('monk')) {
            return super.canAttach(card);
        }
        return false;
    }
}

CentipedeTattoo.id = 'centipede-tattoo';

module.exports = CentipedeTattoo;
