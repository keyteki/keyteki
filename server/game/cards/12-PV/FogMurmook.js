const Card = require('../../Card.js');

class FogMurmook extends Card {
    // While Fog Murmook is not on a flank, keys cost –1 amber.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            condition: (context) => !context.source.isOnFlank(),
            effect: ability.effects.modifyKeyCost(-1)
        });
    }
}

FogMurmook.id = 'fog-murmook';

module.exports = FogMurmook;
