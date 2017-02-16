const DrawCard = require('../../../drawcard.js');

class BridgeOfSkulls extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: (e, phase) =>
                    phase === 'challenge'
                    && this.game.getOtherPlayer(this.controller)
                    && this.game.getOtherPlayer(this.controller)
                    .getNumberOfChallengesInitiatedByType('military') < 1
            },
            handler: () => {
                var opponent = this.game.getOtherPlayer(this.controller);
                if(!opponent) {
                    return true;
                }

                opponent.discardAtRandom(1);

                this.game.addMessage('{0} uses {1} to discard 1 card at random from {2}\'s hand',
                                     this.controller, this, opponent);
            }
        });
    }
}

BridgeOfSkulls.code = '05032';

module.exports = BridgeOfSkulls;
