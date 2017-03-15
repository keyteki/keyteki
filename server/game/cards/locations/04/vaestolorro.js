const DrawCard = require('../../../drawcard.js');

class VaesTolorro extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card) => {
                    if(!card.getPower() >= 1) {
                        return false;
                    }
                    this.pendingCard = card;
                    
                    return true;
                }
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                var power = this.pendingCard.getPower() >= 2 && this.pendingCard.getStrength() === 0 ? 2 : 1;

                this.pendingCard.modifyPower(-power);
                this.modifyPower(power);
                this.game.addMessage('{0} kneels {1} to move {2} power from {3} to {1}', 
                                      this.controller, this, power, this.pendingCard);
            }
        });
    }
}

VaesTolorro.code = '04074';

module.exports = VaesTolorro;
