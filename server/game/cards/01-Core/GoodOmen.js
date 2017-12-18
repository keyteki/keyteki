const DrawCard = require('../../drawcard.js');

class GoodOmen extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add a fate to a character',
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

    canPlay() {
        if(this.controller.opponent && this.controller.showBid < this.controller.opponent.showBid) {
            return super.canPlay();
        }
        return false;
    }
}

GoodOmen.id = 'good-omen';

module.exports = GoodOmen;
