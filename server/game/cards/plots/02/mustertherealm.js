const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class MusterTheRealm extends PlotCard {
    modifyClaim(winner, challengeType, claim) {
        var challenge = this.game.currentChallenge;

        if(!challenge || challenge.attackingPlayer !== this.controller) {
            return claim;
        }

        if(!_.any(challenge.attackers, card => {
            return card.hasTrait('Army');
        })) {
            return claim;
        }

        this.game.addMessage('{0} uses {1} to raise the claim of {1} by 1 for this challenge', this.controller, this);

        return claim + 1;
    }
}

MusterTheRealm.code = '02019';

module.exports = MusterTheRealm;
