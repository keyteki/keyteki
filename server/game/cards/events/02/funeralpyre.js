const DrawCard = require('../../../drawcard.js');

class FuneralPyre extends DrawCard {

    canPlay(player, card) {
        if(player.faction.kneeled) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        player.kneelCard(player.faction);

        // TODO should allow to draw only if we're reacting to a lord/lady
        // being killed. This will be possible only when the in-hand reaction
        // mechanism will be available.
        this.controller.drawCardsToHand(3);

        this.game.addMessage('{0} uses {1} to draw 3 cards',
                             this.controller, this);

        return true;
    }

}

FuneralPyre.code = '02114';

module.exports = FuneralPyre;
