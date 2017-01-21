const DrawCard = require('../../../drawcard.js');

class EddardStark extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onAttackersDeclared: (event, challenge) => challenge.attackingPlayer !== this.controller && this.kneeled
            },
            handler: () => {
                this.controller.standCard(this);

                this.game.addMessage('{0} uses {1} to stand {1}', this.controller, this);
            }
        });
    }
}

EddardStark.code = '01144';

module.exports = EddardStark;
