const DrawCard = require('../../drawcard.js');

class ICanSwim extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard a dishonored character',
            condition: () => this.game.currentConflict && this.controller.opponent && this.controller.showBid > this.controller.opponent.showBid,
            target: {
                cardType: 'character',
                gameAction: 'discardCardFromPlay',
                cardCondition: card => card.isParticipating() && card.isDishonored && card.controller !== this.controller 
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to discard {2}', this.controller, this, context.target);
                this.controller.discardCardFromPlay(context.target);
            }
        });
    }
}

ICanSwim.id = 'i-can-swim';

module.exports = ICanSwim;
