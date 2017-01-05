const DrawCard = require('../../../drawcard.js');

class MoonBoy extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(event, challenge) {
        if(challenge.winner === this.controller || !challenge.isParticipating(this) || this.isBlank()) {
            return;
        }

        this.game.addMessage('{0} is forced to discard 1 card at random after losing a challenge in which {1} was participating', this.controller, this);

        this.controller.discardAtRandom(1);
    }
}

MoonBoy.code = '02047';

module.exports = MoonBoy;
