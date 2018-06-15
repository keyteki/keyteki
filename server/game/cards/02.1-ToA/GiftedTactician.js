const DrawCard = require('../../drawcard.js');

class GiftedTactician extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                afterConflict: event => event.conflict.winner === this.controller && this.isParticipating() && event.conflict.conflictType === 'military'
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
                this.controller.drawCardsToHand(1);
            }
        });
    }
}

GiftedTactician.id = 'gifted-tactician';

module.exports = GiftedTactician;
