const DrawCard = require('../../../drawcard.js');
 
class SerJaimeLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        
        this.registerEvents(['onAttackersDeclared', 'onChallengeFinished']);
    }

    onAttackersDeclared(e, player, challengeType) {
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

    onChallengeFinished(e, challengeType, winner, loser, challenger) {
        if(challengeType === 'military') {
            this.clearRenown();
        }
    }
}

SerJaimeLannister.code = '01087';

module.exports = SerJaimeLannister;
