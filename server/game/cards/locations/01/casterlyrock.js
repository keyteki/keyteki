const DrawCard = require('../../../drawcard.js');

class CasterlyRock extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotFlip']);
    }

    onPlotFlip() {
        if(!this.inPlay) {
            return;
        }

        if(!this.isBlank()) {
            this.owner.addChallenge('intrigue', 1);
        }
    }

    leavesPlay() {
        if(!this.isBlank()) {
            this.owner.addChallenge('intrigue', -1);
        }
    }
}

CasterlyRock.code = '01097';

module.exports = CasterlyRock;
