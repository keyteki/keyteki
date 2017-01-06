const DrawCard = require('../../../drawcard.js');

class ThorenSmallwood extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && !challenge.isAttackerTheWinner()
            },
            handler: () => {
                this.game.addPower(this.controller, 1);

                this.game.addMessage('{0} uses {1} to gain 1 power for their faction after winning a challenge as the defending player', this.controller, this);
            }
        });
    }
}

ThorenSmallwood.code = '04045';

module.exports = ThorenSmallwood;
