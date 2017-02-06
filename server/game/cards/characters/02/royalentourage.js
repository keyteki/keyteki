
const DrawCard = require('../../../drawcard.js');

class RoyalEntourage extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, challenge) => challenge.loser === this.controller && challenge.challengeType === 'intrigue'
            },
            handler: () => {
                this.controller.kneelCard(this);
                this.game.addMessage('{0} is forced to kneel {1}', this.controller, this);
            }
        });
    }
}

RoyalEntourage.code = '02027';

module.exports = RoyalEntourage;
