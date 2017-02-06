const PlotCard = require('../../../plotcard.js');

class MarchingOrders extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'location' || card.getType() === 'attachment',
            targetLocation: 'hand',
            effect: ability.effects.cannotMarshal()
        });
        this.persistentEffect({
            match: card => card.getType() === 'event',
            targetLocation: 'hand',
            effect: ability.effects.cannotPlay()
        });
    }
}

MarchingOrders.code = '01016';

module.exports = MarchingOrders;
