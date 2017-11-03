const DrawCard = require('../../drawcard.js');

class FuneralPyre extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice a character to draw',
            cost: ability.costs.sacrifice(card => card.type === 'character'),
            handler: context => {
                this.game.addMessage('{0} sacrifices {1} using {2} to draw a card', this.controller, context.costs.sacrifice, this);
                this.controller.drawCardsToHand(1);
            }
        });
    }
}

FuneralPyre.id = 'funeral-pyre';

module.exports = FuneralPyre;
