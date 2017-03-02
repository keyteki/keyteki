const DrawCard = require('../../../drawcard.js');

class DonellaHornwood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceFirstMarshalledOrPlayedCardCostEachRound(1, card => card.isLoyal())
        });
    }
}

DonellaHornwood.code = '04021';

module.exports = DonellaHornwood;
