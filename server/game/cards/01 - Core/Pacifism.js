const DrawCard = require('../../drawcard.js');

class Pacifism extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => (
                this.game.currentConflict &&
                this.game.currentConflict.conflictType === 'military'
            ),
            effect: [
                ability.effects.cannotParticipateAsAttacker(),
                ability.effects.cannotParticipateAsDefender()
            ]
        });
    }

    canPlay() {
        if(this.game.currentConflict) {
            return false;
        }

        return super.canPlay();
    }
}

Pacifism.id = 'pacifism';

module.exports = Pacifism;
