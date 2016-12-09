const DrawCard = require('../../../drawcard.js');

class KhalDrogo extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotFlip']);
    }

    onPlotFlip() {
        if(!this.inPlay) {
            return;
        }

        if(!this.isBlank()) {
            this.controller.addChallenge('military', 1);
        }
    }

    leavesPlay() {
        if(!this.isBlank()) {
            this.controller.addChallenge('military', -1);
        }
    }
}

KhalDrogo.code = '01162';

module.exports = KhalDrogo;
