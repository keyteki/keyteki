const PlotCard = require('../../../plotcard.js');

class JoustingContest extends PlotCard {
    flipFaceup() {
        super.flipFaceup();

        this.controller.challengerLimit = 1;
        var otherPlayer = this.game.getOtherPlayer(this.controller);

        if(otherPlayer) {
            otherPlayer.challengerLimit = 1;
        }
    }
}

JoustingContest.code = '01014';

module.exports = JoustingContest;
