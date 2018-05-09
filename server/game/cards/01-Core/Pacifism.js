const DrawCard = require('../../drawcard.js');

class Pacifism extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.cannotParticipateAsAttacker(() => this.game.currentConflict.conflictType === 'military'),
                ability.effects.cannotParticipateAsDefender(() => this.game.currentConflict.conflictType === 'military')
            ]
        });
    }

    canPlay(context) {
        if(this.game.currentConflict) {
            return false;
        }

        return super.canPlay(context);
    }
}

Pacifism.id = 'pacifism';

module.exports = Pacifism;
