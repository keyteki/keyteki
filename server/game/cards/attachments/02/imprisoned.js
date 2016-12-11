const DrawCard = require('../../../drawcard.js');

class Imprisoned extends DrawCard {
    attach(player, card) {
        card.clearIcon('military');
    }

    leavesPlay() {
        super.leavesPlay();
        
        this.parent.setIcon('military');
    }
}

Imprisoned.code = '02116';

module.exports = Imprisoned;
