const DrawCard = require('../../../drawcard.js');
 
class Condemned extends DrawCard {
    attach(player, card) {
        card.setIcon('power');
    }

    leavesPlay() {
        this.parent.setIcon('power');
    }
}

Condemned.code = '02077';

module.exports = Condemned;
