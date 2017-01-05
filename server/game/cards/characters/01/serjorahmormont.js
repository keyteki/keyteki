const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class SerJorahMormont extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(event, challenge) {
        if(challenge.winner !== this.controller || !challenge.isParticipating(this) || this.isBlank()) {
            return;
        }

        this.addToken('betrayal', 1);

        this.game.addMessage('{0} is forced to place a betrayal token on {1} after winning a challenge in which he was participating', this.controller, this);

        if(this.tokens['betrayal'] >= 3) {
            this.controller.sacrificeCard(this);

            this.game.addMessage('{0} sacrifices {1} as it has 3 or more betrayal tokens', this.controller, this);
        }
    }
}

SerJorahMormont.code = '01165';

module.exports = SerJorahMormont;
