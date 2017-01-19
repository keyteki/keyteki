const PlotCard = require('../../../plotcard.js');

class NavalSuperiority extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => (
                card.controller.activePlot === card &&
                (card.hasTrait('Kingdom') || card.hasTrait('Edict'))
            ),
            targetController: 'any',
            effect: ability.effects.preventPlotModifier('gold')
        });
    }
}

NavalSuperiority.code = '01017';

module.exports = NavalSuperiority;
