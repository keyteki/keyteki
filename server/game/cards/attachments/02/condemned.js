const DrawCard = require('../../../drawcard.js');

class Condemned extends DrawCard {
    attach(player, card) {
        card.removeIcon('power');
    }

    leavesPlay() {
        super.leavesPlay();
        
        this.parent.addIcon('power');
    }
}

Condemned.code = '02077';

module.exports = Condemned;
