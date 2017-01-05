const DrawCard = require('../../../drawcard.js');

class Butterbumps extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(event, challenge) {
        if(challenge.winner === this.controller || this.isBlank() || !challenge.isParticipating(this)) {
            return;
        }
        
        this.controller.discardAtRandom(1);

        this.game.addMessage('{0} is forced to use {1} to discard a card from their hand after losing a challenge', this.controller, this);
    }
}

Butterbumps.code = '02103';

module.exports = Butterbumps;
