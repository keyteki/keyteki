const PlotCard = require('../../../plotcard.js');

class Famine extends PlotCard {
    canReduce(player, card) {
        return card.controller !== this.controller && card.getType() === 'character';
    }

    reduce(card, cost) {
        return cost + 1;
    }
}

Famine.code = '02100';

module.exports = Famine;
