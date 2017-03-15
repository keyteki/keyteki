const DrawCard = require('../../../drawcard.js');

class TheStoneDrum extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.anyPlotHasTrait('Kingdom'),
            match: (card) => card === card.controller.activePlot,
            effect: ability.effects.modifyGold(1)
        });
    }
}

TheStoneDrum.code = '04028';

module.exports = TheStoneDrum;
