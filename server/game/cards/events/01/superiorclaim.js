const DrawCard = require('../../../drawcard.js');

class SuperiorClaim extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        if(!this.game.currentChallenge || this.game.currentChallenge.winner !== this.controller || this.game.currentChallenge.strengthDifference < 5 ||
                this.game.currentChallenge.challengeType !== 'power') {
            return false;
        }

        return true;
    }

    play(player) {
        if(this.controller !== player) {
            return;
        }

        this.game.addPower(player, 2);
        this.game.addMessage('{0} uses {1} to gain 2 power for their faction', player, this);
    }
}

SuperiorClaim.code = '01043';

module.exports = SuperiorClaim;
