const DrawCard = require('../../../drawcard.js');

class TheRedViper extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isAttacking(this) && challenge.strengthDifference >= 5
            },
            handler: () => {
                var power = Math.trunc(this.game.currentChallenge.strengthDifference / 5);

                this.modifyPower(power);

                this.game.addMessage('{0} gains {1} power on {2}', this.controller, power, this);
            }
        });
    }
}

TheRedViper.code = '01109';

module.exports = TheRedViper;
