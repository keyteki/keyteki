const PlotCard = require('../../../plotcard.js');

class AClashOfKings extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(challengeType, winner, loser) {
        if(!this.inPlay) {
            return;
        }

        if(winner === this.owner && challengeType === 'power' && loser.power > 0) {
            this.game.addMessage('{0} uses {1} to move 1 power from {2}\'s faction card to their own', winner, this, loser);

            this.game.transferPower(winner, loser, 1);
        }
    }
}

AClashOfKings.code = '01001';

module.exports = AClashOfKings;
