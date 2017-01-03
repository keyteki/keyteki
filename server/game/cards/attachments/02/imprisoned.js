const DrawCard = require('../../../drawcard.js');

class Imprisoned extends DrawCard {
    attach(player, card) {
        card.removeIcon('military');
    }

    leavesPlay() {
        super.leavesPlay();
        
        this.parent.addIcon('military');
    }
}

Imprisoned.code = '02116';

module.exports = Imprisoned;
