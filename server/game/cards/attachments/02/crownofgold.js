const DrawCard = require('../../../drawcard.js');
 
class CrownOfGold extends DrawCard {
    attach(player, card) {
        card.addTrait('King');

        card.strengthModifier -= 4;

        if(card.getStrength() <= 0) {
            card.controller.killCharacter(card, false);

            this.game.addMessage('{0} uses {1} to kill {2} as its STR is 0', this.controller, this, card);
        }

        super.attach(player, card);
    }

    leavesPlay() {
        super.leavesPlay();

        this.parent.removeTrait('King');
    }
}

CrownOfGold.code = '02034';

module.exports = CrownOfGold;
