const DrawCard = require('../../drawcard.js');

class RaiseTheAlarm extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Flip a dynasty card',
            condition: () => {
                if(!this.controller.isDefendingPlayer() || !this.game.currentConflict.conflictProvince || this.game.currentConflict.conflictType !== 'military') {
                    return false;
                }
                let dynastyCard = this.controller.getDynastyCardInProvince(this.game.currentConflict.conflictProvince.location);
                return dynastyCard && dynastyCard.facedown;
            },
            handler: () => {
                let card = this.controller.getDynastyCardInProvince(this.game.currentConflict.conflictProvince.location);
                card.facedown = false;
                if(card.type === 'character' && this.controller.canPutIntoPlay(card, true)) {
                    this.game.addMessage('{0} uses {1} to bring {2} into the conflict!', this.controller, this, card);
                    this.controller.putIntoPlay(card, true);
                }
                else {
                    this.game.addMessage('{0} uses {1} but cannot bring {2} into the conflict!', this.controller, this, card);
                }
            }
        });
    }
}

RaiseTheAlarm.id = 'raise-the-alarm';

module.exports = RaiseTheAlarm;
