const DrawCard = require('../../../drawcard.js');

class AMeagerContribution extends DrawCard {

    canPlay(player, card) {
        this.otherPlayer = this.game.getOtherPlayer(player);
        if(!this.otherPlayer || this.otherPlayer.gold < 1) {
            return false;
        }

        // TODO should be playable only as a reaction to opponent collecting
        // income. This will be possible only when the in-hand reaction
        // mechanism will be available.

        return super.canPlay(player, card);
    }

    play(player) {
        this.game.addGold(this.otherPlayer, -1);
        this.game.addGold(player, 1);

        this.game.addMessage('{0} uses {1} to move 1 gold from {2}\'s gold pool to their own',
                             this.controller, this, this.otherPlayer);

        this.otherPlayer = undefined;
    }

}

AMeagerContribution.code = '01138';

module.exports = AMeagerContribution;
