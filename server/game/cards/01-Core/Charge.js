const DrawCard = require('../../drawcard.js');

class Charge extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put a character into play from a province',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            target: {
                cardType: 'character',
                cardCondition: card => (['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) && 
                        card.controller === this.controller && !card.facedown && this.controller.canPutIntoPlay(card, true))
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bring {2} into the conflict!', this.controller, this, context.target);
                this.controller.putIntoPlay(context.target, true);
            }
        });
    }
}

Charge.id = 'charge';

module.exports = Charge;
