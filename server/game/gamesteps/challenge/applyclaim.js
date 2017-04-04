const BaseStep = require('../basestep.js');
const FulfillMilitaryClaim = require('./fulfillmilitaryclaim.js');

class ApplyClaim extends BaseStep {
    constructor(game, challenge) {
        super(game);
        this.challenge = challenge;
    }

    continue() {
        this.game.raiseEvent('onClaimApplied', this.challenge, () => {
            switch(this.challenge.challengeType) {
                case 'military':
                    this.game.addMessage('{0} claim is applied.  {1} must kill {2} character{3}', this.challenge.challengeType, this.challenge.loser, this.challenge.claim,
                        this.challenge.claim > 1 ? 's' : '');
                    this.game.queueStep(new FulfillMilitaryClaim(this.game, this.challenge.loser, this.challenge.claim));
                    break;
                case 'intrigue':
                    this.game.addMessage('{0} claim is applied.  {1} must discard {2} card{3} at random', this.challenge.challengeType, this.challenge.loser, this.challenge.claim,
                        this.challenge.claim > 1 ? 's' : '');
                    this.challenge.loser.discardAtRandom(this.challenge.claim);
                    break;
                case 'power':
                    if(this.challenge.loser.faction.power > 0) {
                        this.game.addMessage('{0} claim is applied.  {1} removes {2} power and {3} gains {2} power', this.challenge.challengeType, this.challenge.loser, this.challenge.claim,
                            this.challenge.winner);
                    }
                    this.game.transferPower(this.challenge.winner, this.challenge.loser, this.challenge.claim);
                    break;
            }
        });

        return true;
    }
}

module.exports = ApplyClaim;
