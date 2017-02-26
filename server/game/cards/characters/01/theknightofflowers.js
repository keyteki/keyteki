const DrawCard = require('../../../drawcard.js');

class TheKnightOfFlowers extends DrawCard {

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.game.currentChallenge
                && this.game.currentChallenge.isAttacking(this)
                && this.game.currentChallenge.attackers.length === 1,
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.setChallengerLimit(1)
        });
    }

}

TheKnightOfFlowers.code = '01185';

module.exports = TheKnightOfFlowers;
