const DrawCard = require('../../../drawcard.js');

class Ward extends DrawCard {
    canAttach(player, card) {
        if(card.getType() !== 'character' || card.getCost() > 4) {
            return false;
        }

        return super.canAttach(player, card);
    }

    attach(player, card) {
        if(card.controller === player) {
            return;
        }

        this.game.takeControl(player, card);
        this.game.addMessage('{0} uses {1} to take control of {2} and give them the {3} affiliation', player, this, card, 'stark');
    }

    leavesPlay() {
        super.leavesPlay();

        if(this.parent.owner !== this.parent.controller) {
            this.game.takeControl(this.parent.owner, this.parent);
        }
    }
}

Ward.code = '02102';

module.exports = Ward;
