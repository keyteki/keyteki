const PlotCard = require('../../../plotcard.js');

class TheLongPlan extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onBeforeTaxation']);
    }

    onBeforeTaxation(event, player) {
        if(this.controller !== player) {
            return;
        }

        event.cancel = true;
    }

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
    }
}

TheLongPlan.code = '02016';

module.exports = TheLongPlan;
