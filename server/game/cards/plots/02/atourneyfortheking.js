const PlotCard = require('../../../plotcard.js');

class ATourneyForTheKing extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'character' && card.hasTrait('Knight'),
            targetController: 'current',
            effect: [
                ability.effects.addKeyword('Renown'),
                ability.effects.immuneTo(card => card.controller !== this.controller && card.getType() === 'event')
            ]
        });
    }
}

ATourneyForTheKing.code = '02059';

module.exports = ATourneyForTheKing;
