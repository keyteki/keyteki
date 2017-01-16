const DrawCard = require('../../../drawcard.js');

class SerJorahMormont extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isParticipating(this)
            },
            handler: () => {
                this.addToken('betrayal', 1);
                this.game.addMessage('{0} is forced to place a betrayal token on {1} after winning a challenge in which he was participating', this.controller, this);

                if(this.tokens['betrayal'] >= 3) {
                    this.controller.sacrificeCard(this, false);

                    this.game.addMessage('{0} sacrifices {1} as it has 3 or more betrayal tokens', this.controller, this);
                }
            }
        });
    }
}

SerJorahMormont.code = '01165';

module.exports = SerJorahMormont;
