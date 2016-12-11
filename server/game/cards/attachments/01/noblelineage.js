const DrawCard = require('../../../drawcard.js');

class NobleLineage extends DrawCard {
    attach(player, card) {
        card.setIcon('power');
    }

    leavesPlay() {
        super.leavesPlay();
        
        this.parent.setIcon('power');
    }
}

NobleLineage.code = '01036';

module.exports = NobleLineage;
