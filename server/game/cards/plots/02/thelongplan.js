const PlotCard = require('../../../plotcard.js');

class TheLongPlan extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.loser === this.controller
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain 1 gold from losing a challenge', this.controller, this);
                this.game.addGold(this.controller, 1);
            }
        });
        // TODO: This is a hack, really the ability should be a persistent effect.
        this.forcedInterrupt({
            when: {
                onUnspentGoldReturned: (event, player) => player === this.controller
            },
            handler: context => {
                context.skipHandler();
                // Do nothing - just needed to prevent gold from being returned.
            }
        });
    }
}

TheLongPlan.code = '02016';

module.exports = TheLongPlan;
