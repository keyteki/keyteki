const DrawCard = require('../../../drawcard.js');

class SyriosTraining extends DrawCard {
    attach(player, card) {
        card.setIcon('military');
    }

    leavesPlay() {
        this.parent.setIcon('military');
    }
}

SyriosTraining.code = '01037';

module.exports = SyriosTraining;
