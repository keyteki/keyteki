const DrawCard = require('../../../drawcard.js');

class TheDragonsTail extends DrawCard {

    canPlay(player, card) {
        if(!this.game.getOtherPlayer(player)) {
            return false;
        }

        return super.canPlay(player, card);
    }


    play(player) {
        var opponent = this.game.getOtherPlayer(player);

        this.controller.drawCardsToHand(2);
        opponent.drawCardsToHand(2);

        this.game.addMessage('{0} uses {1} to make both players draw 2 cards',
                             this.controller, this);
    }

}

TheDragonsTail.code = '04001';

module.exports = TheDragonsTail;
