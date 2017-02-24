const PlotCard = require('../../../plotcard.js');

class ANobleCause extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceNextMarshalledCardCost(2, card => card.hasTrait('Lord') || card.hasTrait('Lady'))
        });
    }
}

ANobleCause.code = '01004';

module.exports = ANobleCause;
