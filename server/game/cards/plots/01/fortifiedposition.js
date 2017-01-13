const PlotCard = require('../../../plotcard.js');

class FortifiedPosition extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'character',
            targetController: 'any',
            effect: ability.effects.blank
        });
    }
}

FortifiedPosition.code = '01012';

module.exports = FortifiedPosition;
