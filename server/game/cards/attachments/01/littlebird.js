const DrawCard = require('../../../drawcard.js');

class LittleBird extends DrawCard {
    attach(player, card) {
        card.setIcon('intrigue');
    }

    leavesPlay() {
        this.parent.setIcon('intrigue');
    }
}

LittleBird.code = '01034';

module.exports = LittleBird;
