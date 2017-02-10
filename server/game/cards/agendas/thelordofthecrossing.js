const AgendaCard = require('../../agendacard.js');

class TheLordOfTheCrossing extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.currentChallenge && this.game.currentChallenge.attackingPlayer === this.controller,
            match: card => this.game.currentChallenge.isAttacking(card),
            recalculateWhen: ['onAttackersDeclared'],
            effect: ability.effects.dynamicStrength(() => this.challengeBonus())
        });
    }

    challengeBonus() {
        var numChallenges = this.controller.getNumberOfChallengesInitiated();
        if(numChallenges === 1) {
            return -1;
        }

        if(numChallenges === 3) {
            return 2;
        }

        return 0;
    }

    afterChallenge(e, challenge) {
        if(challenge.attackingPlayer !== this.controller) {
            return;
        }

        var currentChallenge = this.controller.getNumberOfChallengesInitiated();
        if(challenge.winner === this.controller && currentChallenge === 3) {
            this.game.addMessage('{0} gains 1 power from {1}', challenge.winner, this);
            this.game.addPower(challenge.winner, 1);
        }
    }
}

TheLordOfTheCrossing.code = '02060';

module.exports = TheLordOfTheCrossing;
