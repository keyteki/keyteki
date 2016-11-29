const DrawCard = require('../../../drawcard.js');
 
class CerseiLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        
        this.registerEvents(['onAttackersDeclared', 'onChallengeFinished']);
    }

    onAttackersDeclared(player, challengeType) {
        if(!this.inPlay || challengeType !== 'military') {
            return;
        }

        if(!this.isBlank()) {
            this.setRenown();
        }

        if(this.owner !== player) {
            return;
        }

        if(!this.isBlank() && player.cardsInChallenge.any(card => {
            return card.uuid === this.uuid;
        })) {
            this.kneeled = false;
        }
    }

    onChallengeFinished(challengeType, winner, loser, challenger) {
        if(challengeType === 'military') {
            this.clearRenown();
        }
    }
}

CerseiLannister.code = '01087';

module.exports = CerseiLannister;
