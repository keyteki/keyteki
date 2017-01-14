const PlotCard = require('../../../plotcard.js');

class LionsOfTheRock extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event, phase) => phase === 'challenge'
            },
            handler: () => {
                this.game.addGold(this.controller, 3);
                this.game.addMessage('{0} uses {1} to gain 3 gold', this.controller, this);
            }
        });
    }
}

LionsOfTheRock.code = '05046';

module.exports = LionsOfTheRock;
