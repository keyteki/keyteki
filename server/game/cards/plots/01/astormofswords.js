const PlotCard = require('../../../plotcard.js');

class AStormOfSwords extends PlotCard {
    flipFaceup() {
        super.flipFaceup();

        this.controller.addChallenge('military', 1);

        this.game.addMessage('{0} uses {1} to gain an additional military challenge this round', this.controller, this);

        return true;
    }
}

AStormOfSwords.code = '01005';

module.exports = AStormOfSwords;
