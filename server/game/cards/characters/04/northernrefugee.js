const DrawCard = require('../../../drawcard.js');

class NorthernRefugee extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: () => this.game.anyPlotHasTrait('Winter'),
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceSelfCost('marshal', 1)
        });
    }
}

NorthernRefugee.code = '04117';

module.exports = NorthernRefugee;
