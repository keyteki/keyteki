const DrawCard = require('../../../drawcard.js');

class KhalDrogo extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotFlip']);
    }

    onPlotFlip() {
        if(!this.isBlank()) {
            this.challengeAdded = true;
            this.controller.addChallenge('military', 1);
        }
    }

    leavesPlay() {
        super.leavesPlay();
        
        if(this.challengeAdded) {
            this.controller.addChallenge('military', -1);
        }
    }
}

KhalDrogo.code = '01162';

module.exports = KhalDrogo;
