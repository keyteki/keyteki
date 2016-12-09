const PlotCard = require('../../../plotcard.js');

class Taxation extends PlotCard {
    flipFaceup() {
        super.flipFaceup();

        this.controller.maxLimited++;
    
        this.game.addMessage('{0} uses {1} to gain be able to play an additional Limited card this round', this.controller, this);
    }

    leavesPlay() {
        super.leavesPlay();

        this.controller.maxLimited--;
    }
}

Taxation.code = '01024';

module.exports = Taxation;
