const DrawCard = require('../../../drawcard.js');

class SwornBrother extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledCardCostEachRound(1, card => card.getType() === 'location')
        });
    }
}

SwornBrother.code = '02105';

module.exports = SwornBrother;
