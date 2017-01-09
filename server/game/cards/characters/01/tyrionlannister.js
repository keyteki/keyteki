const DrawCard = require('../../../drawcard.js');
const AbilityLimit = require('../../../abilitylimit.js');

class TyrionLannister extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onChallenge: (event, challenge) => challenge.challengeType === 'intrigue'
            },
            limit: AbilityLimit.perRound(2),
            handler: () => {
                this.game.addGold(this.controller, 2);
                this.game.addMessage('{0} uses {1} to gain 2 gold as an intrigue challenge has been declared', this.controller, this);
            }
        });
    }
}

TyrionLannister.code = '01089';

module.exports = TyrionLannister;
