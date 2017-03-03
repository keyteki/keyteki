const DrawCard = require('../../../drawcard.js');

class MaesterLomys extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.defendingPlayer === this.controller && challenge.challengeType === 'intrigue'
            },
            handler: () => {
                this.game.currentChallenge.loser.discardAtRandom(1);

                this.game.addMessage('{0} uses {1} to discard 1 card at random from {2}\'s hand', this.controller, this, this.game.currentChallenge.loser);
            }
        });
    }
}

MaesterLomys.code = '01180';

module.exports = MaesterLomys;
