const DrawCard = require('../../drawcard.js');

class CourtMask extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return court mask to hand',
            handler: () => {
                this.game.addMessage('{0} returns {1} to their hand, dishonoring {2}', this.controller, this, this.parent);
                // TODO: these effects should really be packaged in a multievent window
                this.controller.dishonorCard(this.parent);
                this.controller.returnCardToHand(this);
            }
        });
    }
    
    canAttach(player, card) {
        if(card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(player, card);
    }
}

CourtMask.id = 'court-mask';

module.exports = CourtMask;

