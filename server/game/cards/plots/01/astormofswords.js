const PlotCard = require('../../../plotcard.js');

class AStormOfSwords extends PlotCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.modifyChallengeTypeLimit('military', 1)
        });
    }
}

AStormOfSwords.code = '01005';

module.exports = AStormOfSwords;
