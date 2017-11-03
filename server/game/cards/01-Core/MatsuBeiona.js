const DrawCard = require('../../drawcard.js');

class MatsuBeiona extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 2 fate',
            when: {
                'onCardEntersPlay': event => event.card === this && this.controller.filterCardsInPlay(card => card.hasTrait('bushi') && card.getType() === 'character' && card !== this).length >= 3
            },
            handler: () => {
                this.game.addMessage('{0} uses {1}\'s ability to put 2 fate on {1}', this.controller, this);
                this.modifyFate(2);
            }
        });
    }
}

MatsuBeiona.id = 'matsu-beiona';

module.exports = MatsuBeiona;
