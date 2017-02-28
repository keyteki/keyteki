const DrawCard = require('../../../drawcard.js');

class RenlyBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledCardCostEachRound(1, card => (
                card.getType() === 'character' &&
                !card.isFaction('baratheon')
            ))
        });
    }
}

RenlyBaratheon.code = '02007';

module.exports = RenlyBaratheon;
