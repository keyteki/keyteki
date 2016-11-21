const Reducer = require('../../reducer.js').Reducer;

class TheKingsroad extends Reducer {
    constructor(owner, cardData) {
        super(owner, cardData, 3, (player, card) => {
            return card.getType() === 'character';
        });
    }

    clicked(player) {
        var handled = super.clicked(player);

        if(handled) {
            this.game.addMessage('{0} kneels and sacrifices {1} to reduce the cost of the next character by 3', player, this);
        }

        return handled;
    }
    
    reduce(card, currentCost, spending) {
        var cost = super.reduce(card, currentCost, spending);

        if(spending) {
            this.owner.discardCard(this.uuid, this.owner.discardPile);
        }

        return cost;
    }
}

TheKingsroad.code = '01039';

module.exports = TheKingsroad;
