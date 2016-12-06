const DrawCard = require('../../../drawcard.js');
 
class SerJaimeLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        
        this.registerEvents(['onAttackersDeclared', 'onChallengeFinished']);
    }

    onAttackersDeclared(event, player, challengeType) {
        if(!this.inPlay || challengeType !== 'military') {
            return;
        }

        if(!this.isBlank()) {
            this.addKeyword('renown');
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

    onChallengeFinished(event, challengeType) {
        if(challengeType === 'military') {
            this.removeKeyword('renown');
        }
    }
}

SerJaimeLannister.code = '01087';

module.exports = SerJaimeLannister;
