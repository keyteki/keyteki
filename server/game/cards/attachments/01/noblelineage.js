const DrawCard = require('../../../drawcard.js');

class NobleLineage extends DrawCard {
    attach(player, card) {
        card.addIcon('power');
    }

    leavesPlay() {
        super.leavesPlay();
        
        this.parent.addIcon('power');
    }
}

NobleLineage.code = '01036';

module.exports = NobleLineage;
