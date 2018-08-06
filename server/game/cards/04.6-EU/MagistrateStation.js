const ProvinceCard = require('../../provincecard.js');

class MagistrateStation extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Ready an honored character',
            target: {
                cardType: 'character',
                cardCondition: card => card.isHonored,
                gameAction: ability.actions.ready()
            }
        });
    }
}

MagistrateStation.id = 'magistrate-station';

module.exports = MagistrateStation;
