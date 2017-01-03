const DrawCard = require('../../../drawcard.js');

class LittleBird extends DrawCard {
    attach(player, card) {
        card.addIcon('intrigue');
    }

    leavesPlay() {
        super.leavesPlay();
        
        this.parent.addIcon('intrigue');
    }
}

LittleBird.code = '01034';

module.exports = LittleBird;
