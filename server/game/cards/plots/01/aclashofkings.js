const PlotCard = require('../../../plotcard.js');

class AClashOfKings extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.challengeType === 'power' &&
                    challenge.loser.faction.power > 0
                )
            },
            handler: () => {
                var challenge = this.game.currentChallenge;
                this.game.addMessage('{0} uses {1} to move 1 power from {2}\'s faction card to their own', challenge.winner, this, challenge.loser);
                this.game.transferPower(challenge.winner, challenge.loser, 1);
            }
        });
    }
}

AClashOfKings.code = '01001';

module.exports = AClashOfKings;
