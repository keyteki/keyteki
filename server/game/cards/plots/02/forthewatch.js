const PlotCard = require('../../../plotcard.js');

class ForTheWatch extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onChallenge']);
    }

    onChallenge(event, challenge) {
        if(challenge.attackingPlayer === this.controller || challenge.attackingPlayer.challenges.complete >= 1) {
            return;
        }

        challenge.attackerCannotWin = true;
    } 
}

ForTheWatch.code = '02067';

module.exports = ForTheWatch;
