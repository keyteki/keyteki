const DrawCard = require('../../../drawcard.js');
 
class Attainted extends DrawCard {
    attach(player, card) {
        card.clearIcon('intrigue');
    }

    leavesPlay() {
        this.parent.setIcon('intrigue');
    }
}

Attainted.code = '02055';

module.exports = Attainted;
