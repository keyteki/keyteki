const DrawCard = require('../../../drawcard.js');

class PaxterRedwyne extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            gold: 1
        });
        this.persistentEffect({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.reduceFirstPlayedCardCostEachRound(1, card => card.getType() === 'event')
        });
    }
}

PaxterRedwyne.code = '01182';

module.exports = PaxterRedwyne;
