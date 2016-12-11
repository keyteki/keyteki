const DrawCard = require('../../../drawcard.js');
 
class Knighted extends DrawCard {
    attach(player, card) {
        card.strengthModifier++;
        card.addTrait('Knight');
    }

    leavesPlay() {
        super.leavesPlay();
        
        this.parent.strengthModifier--;
        this.parent.removeTrait('Knight');
    }
}

Knighted.code = '02058';

module.exports = Knighted;
