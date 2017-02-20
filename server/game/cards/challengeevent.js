const DrawCard = require('../drawcard.js');

class ChallengeEvent extends DrawCard {
    // event card that can only be played during a challenge

    constructor(owner, cardData, challengeType, participatingAs) {
        // - challengeType (optional): make the event playable only on a
        //   challenge of the given type
        //
        // - participatingAs (optional): make the event playable only when the
        //   event controller is participating as either 'attacker' or
        //   'defender'
        //
        super(owner, cardData);

        this.challengeType = challengeType;
        this.participatingAs = participatingAs;
    }

    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        var challenge = this.game.currentChallenge;
        if(!challenge) {
            return false;
        }
        if(this.challengeType && challenge.challengeType !== this.challengeType) {
            return false;
        }
        if((this.participatingAs === 'attacker' && challenge.attackingPlayer !== this.controller) ||
           (this.participatingAs === 'defender' && challenge.defendingPlayer !== this.controller)) {
            return false;
        }

        return super.canPlay(player, card);
    }

}

module.exports = ChallengeEvent;
