const PlotCard = require('../../../plotcard.js');

class Famine extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.increaseCost({
                playingTypes: 'marshal',
                amount: 1,
                match: card => card.getType() === 'character'
            })
        });
    }
}

Famine.code = '02100';

module.exports = Famine;
