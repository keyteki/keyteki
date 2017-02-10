const PlotCard = require('../../../plotcard.js');

class SnowedUnder extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.controller.activePlot === card,
            targetController: 'any',
            effect: ability.effects.preventPlotModifier('initiative')
        });
    }
}

SnowedUnder.code = '03048';

module.exports = SnowedUnder;
