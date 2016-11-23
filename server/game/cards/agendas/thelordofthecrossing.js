const AgendaCard = require('../../agendacard.js');
 
class TheLordOfTheCrossing extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onChallenge', 'afterChallenge']);
    }

    onChallenge(player) {
        if(this.owner !== player) {
            return;
        }

        player.cardsInChallenge.each(card => {
            var numChallenges = player.getNumberOfChallengesInitiated(); 
            if(numChallenges === 0) {
                card.strengthModifier--;
            } else if(numChallenges === 2) {
                card.strengthModifier += 2;
            }
        });
    }
    
    afterChallenge(challengeType, winner) {
        var currentChallenge = winner.getNumberOfChallengesInitiated();
        if(winner === this.owner && currentChallenge === 3) {
            this.game.addMessage('{0} gains 1 power from {1}', winner, this);
            this.game.addPower(winner, 1);
        }

        this.owner.cardsInChallenge.each(card => {
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
