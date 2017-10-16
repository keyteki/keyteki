const DrawCard = require('../../drawcard.js');

class GoodOmen extends DrawCard {
    setupCardAbilities() {
        this.action({
            condition: () => this.controller.showBid < this.game.getOtherPlayer(this.controller).showBid,
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.getCost() >= 3
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to add 1 fate to {2}', this.controller, this, context.target);
                context.target.modifyFate(1);
            }
        });
    }
}

GoodOmen.id = 'good-omen';

module.exports = GoodOmen;
