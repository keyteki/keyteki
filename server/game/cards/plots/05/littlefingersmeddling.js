const PlotCard = require('../../../plotcard.js');

class LittleFingersMeddling extends PlotCard {
    canReduce(player, card) {
        return card.controller === this.controller && card.getType() === 'event';
    }

    reduce(card, cost) {
        return cost - 2;
    }
}

LittleFingersMeddling.code = '05049';

module.exports = LittleFingersMeddling;
