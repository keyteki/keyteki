const DrawCard = require('../../../drawcard.js');

class CasterlyRock extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotFlip']);
    }

    onPlotFlip() {
        if(!this.isBlank()) {
            this.controller.addChallenge('intrigue', 1);
        }
    }

    leavesPlay() {
        super.leavesPlay();
        
        if(!this.isBlank()) {
            this.controller.addChallenge('intrigue', -1);
        }
    }
}

CasterlyRock.code = '01097';

module.exports = CasterlyRock;
