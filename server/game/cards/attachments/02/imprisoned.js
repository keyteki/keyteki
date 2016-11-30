const DrawCard = require('../../../drawcard.js');
 
class Imprisoned extends DrawCard {
    attach(player, card) {
        card.setIcon('military');
    }

    leavesPlay() {
        this.parent.setIcon('military');
    }
}

Imprisoned.code = '02116';

module.exports = Imprisoned;
