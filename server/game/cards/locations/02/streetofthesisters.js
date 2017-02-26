const DrawCard = require('../../../drawcard.js');

class StreetOfTheSisters extends DrawCard {

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) =>
                    challenge.winner === this.controller
                    && challenge.challengeType === 'power'
                    && challenge.strengthDifference >= 5
            },
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.game.addPower(this.controller, 1);

                this.game.addMessage('{0} uses {1} to gain 1 power for their faction',
                                     this.controller, this);
            }
        });
    }

}

StreetOfTheSisters.code = '02018';

module.exports = StreetOfTheSisters;
