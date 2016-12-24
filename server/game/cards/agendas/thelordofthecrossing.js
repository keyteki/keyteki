const _ = require('underscore');

const AgendaCard = require('../../agendacard.js');

class TheLordOfTheCrossing extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onChallenge', 'afterChallenge']);
    }

    onChallenge(e, challenge) {
        var player = challenge.attackingPlayer;
        if(this.controller !== player) {
            return;
        }

        _.each(challenge.attackers, card => {
            var numChallenges = player.getNumberOfChallengesInitiated();
            if(numChallenges === 0) {
                card.strengthModifier--;
            } else if(numChallenges === 2) {
                card.strengthModifier += 2;
            }
        });
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

        _.each(challenge.attackers, card => {
            if(currentChallenge === 1) {
                card.strengthModifier++;
            } else if(currentChallenge === 3) {
                card.strengthModifier -= 2;
            }
        });
    }
}

TheLordOfTheCrossing.code = '02060';

module.exports = TheLordOfTheCrossing;
