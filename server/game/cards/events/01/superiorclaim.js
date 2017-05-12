const DrawCard = require('../../../drawcard.js');

class SuperiorClaim extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.challengeType === 'power' &&
                    challenge.winner === this.controller &&
                    challenge.strengthDifference >= 5
                )
            },
            handler: () => {
                this.game.addPower(this.controller, 2);
                this.game.addMessage('{0} uses {1} to gain 2 power for their faction', this.controller, this);
            }
        });
    }
}

SuperiorClaim.code = '01043';

module.exports = SuperiorClaim;
