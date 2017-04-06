const DrawCard = require('../../../drawcard.js');

class SerBarristanSelmy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) =>
                    challenge.winner === this.controller
                    && challenge.isParticipating(this)
                    && this.game.getOtherPlayer(this.controller)
                    && this.controller.hand.size() < this.game.getOtherPlayer(this.controller).hand.size()
            },
            handler: () => {
                this.controller.standCard(this);
                this.game.addMessage('{0} uses {1} to stand {1}',
                                     this.controller, this, this);
            }
        });
    }
}

SerBarristanSelmy.code = '05035';

module.exports = SerBarristanSelmy;
