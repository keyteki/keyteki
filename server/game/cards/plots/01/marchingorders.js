const PlotCard = require('../../../plotcard.js');

class MarchingOrders extends PlotCard {
    canPlay(player, cardId) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        var card = player.findCardByUuid(player.hand, cardId);

        if(!card) {
            return false;
        }

        if(card.getType() === 'location' || card.getType() === 'attachment' || card.getType() === 'event') {
            return false;
        }

        return true;
    }
}

MarchingOrders.code = '01016';

module.exports = MarchingOrders;
