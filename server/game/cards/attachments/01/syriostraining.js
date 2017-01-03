const DrawCard = require('../../../drawcard.js');

class SyriosTraining extends DrawCard {
    attach(player, card) {
        card.addIcon('military');
    }

    leavesPlay() {
        super.leavesPlay();
        
        this.parent.addIcon('military');
    }
}

SyriosTraining.code = '01037';

module.exports = SyriosTraining;
