const DrawCard = require('../../../drawcard.js');

class TommenBaratheon extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.hand.size() === 0,
            targetType: 'player',
            effect: ability.effects.cannotGainChallengeBonus()
        });

        this.persistentEffect({
            condition: () => this.opponentHasNoCardsInHand(),
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.cannotGainChallengeBonus()
        });
    }

    opponentHasNoCardsInHand() {
        var opponent = this.game.getOtherPlayer(this.controller);

        if(!opponent) {
            return true;
        }
        
        return opponent.hand.size() === 0;
    }
}

TommenBaratheon.code = '05015';

module.exports = TommenBaratheon;
