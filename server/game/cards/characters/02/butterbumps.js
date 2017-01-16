const DrawCard = require('../../../drawcard.js');

class Butterbumps extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, challenge) => challenge.loser === this.controller && challenge.isParticipating(this)
            },
            handler: () => {
                this.controller.discardAtRandom(1);
                this.game.addMessage('{0} is forced to use {1} to discard a card from their hand after losing a challenge', this.controller, this);
            }
        });
    }
}

Butterbumps.code = '02103';

module.exports = Butterbumps;
