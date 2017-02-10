const PlotCard = require('../../../plotcard.js');

class RainsOfAutumn extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.plotModifierValues.gold > 0 && (card.getType() === 'character' || card.getType() === 'location'),
            targetController: 'any',
            effect: ability.effects.preventPlotModifier('gold')
        });
    }
}

RainsOfAutumn.code = '04019';

module.exports = RainsOfAutumn;
