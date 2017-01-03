const DrawCard = require('../../../drawcard.js');

class Attainted extends DrawCard {
    attach(player, card) {
        card.removeIcon('intrigue');
    }

    leavesPlay() {
        super.leavesPlay();
        
        this.parent.addIcon('intrigue');
    }
}

Attainted.code = '02055';

module.exports = Attainted;
