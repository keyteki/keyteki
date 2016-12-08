const PlotCard = require('../../../plotcard.js');

class AClashOfKings extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(e, challenge) {
        if(!this.inPlay) {
            return;
        }

        if(challenge.winner === this.owner && challenge.challengeType === 'power' && challenge.loser.power > 0) {
            this.game.addMessage('{0} uses {1} to move 1 power from {2}\'s faction card to their own', challenge.winner, this, challenge.loser);

            this.game.transferPower(challenge.winner, challenge.loser, 1);
        }
    }
}

AClashOfKings.code = '01001';

module.exports = AClashOfKings;
