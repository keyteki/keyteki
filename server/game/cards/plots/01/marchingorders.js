const PlotCard = require('../../../plotcard.js');

class MarchingOrders extends PlotCard {
    canPlay(player, card) {
        if(!this.inPlay || this.controller !== player || this.controller !== card.controller) {
            return true;
        }

        if(card.getType() === 'location' || card.getType() === 'attachment' || card.getType() === 'event') {
            return false;
        }

        return true;
    }
}

MarchingOrders.code = '01016';

module.exports = MarchingOrders;
