const DrawCard = require('../../drawcard.js');

class CourtMask extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return court mask to hand',
            handler: context => {
                this.game.addMessage('{0} returns {1} to their hand, dishonoring {2}', this.controller, this, this.parent);
                this.game.applyGameAction(context, {
                    returnToHand: this,
                    dishonor: this.parent
                });
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

