const DrawCard = require('../../drawcard.js');

class GoodOmen extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add a fate to a character',
            target: {
                cardType: 'character', 
                cardCondition: card => card.getCost() > 2,
                gameAction: ability.actions.placeFate()
            }
        });
    }

    canPlay(context) {
        if(this.controller.opponent && this.controller.showBid < this.controller.opponent.showBid) {
            return super.canPlay(context);
        }
        return false;
    }
}

GoodOmen.id = 'good-omen';

module.exports = GoodOmen;
