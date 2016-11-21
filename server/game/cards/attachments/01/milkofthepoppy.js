const DrawCard = require('../../../drawcard.js');
 
class MilkOfThePoppy extends DrawCard {
    attach(player, card) {
        card.setBlank();
    }

    leavesPlay() {
        this.parent.clearBlank();
    }
}

MilkOfThePoppy.code = '01035';

module.exports = MilkOfThePoppy;
