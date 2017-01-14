const PlotCard = require('../../../plotcard.js');

class RangersCache extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseEnded: (event, phase) => phase === 'taxation'
            },
            choices: {
                'Gain 3 gold': () => {
                    this.game.addGold(this.controller, 3);
                    this.game.addMessage('{0} uses {1} to gain 3 gold', this.controller, this);
                },
                'Draw 2 cards': () => {
                    this.controller.drawCardsToHand(2);
                    this.game.addMessage('{0} uses {1} to draw 2 card', this.controller, this);
                }
            }
        });
    }
}

RangersCache.code = '03052';

module.exports = RangersCache;
