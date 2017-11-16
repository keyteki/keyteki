const DrawCard = require('../../drawcard.js');

class CourtMask extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return court mask to hand',
            handler: () => {
                this.game.addMessage('{0} returns {1} to their hand, dishonoring {2}', this.controller, this, this.parent);
                let returnEvent = {
                    name: 'onCardLeavesPlay',
                    params: { card: this, destination: 'hand', source: this },
                    handler: () => this.controller.returnCardToHand(this)
                };
                let dishonorEvent = {
                    name: 'onCardDishonored',
                    params: { player: this.controller, card: this.parent, source: this, order: -1 },
                    handler: () => this.parent.dishonor()
                };
                this.game.raiseMultipleEvents([returnEvent, dishonorEvent]);
            }
        });
    }
    
    canAttach(card) {
        if(card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(card);
    }
}

CourtMask.id = 'court-mask';

module.exports = CourtMask;

