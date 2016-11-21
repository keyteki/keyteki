const PlotCard = require('../../../plotcard.js');

class JoustingContest extends PlotCard {
    flipFaceup() {
        super.flipFaceup();

        this.owner.challengerLimit = 1;
        var otherPlayer = this.game.getOtherPlayer(this.owner);

        if(otherPlayer) {
            otherPlayer.challengerLimit = 1;
        }
    }
}

JoustingContest.code = '01014';

module.exports = JoustingContest;
