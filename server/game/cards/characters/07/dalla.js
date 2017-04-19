const DrawCard = require('../../../drawcard.js');

class Dalla extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => card.controller === this.controller && card.hasTrait('Wildling') && card.getType() === 'character'
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
            }
        });
    }
}

Dalla.code = '07040';

module.exports = Dalla;
