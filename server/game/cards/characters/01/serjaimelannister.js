const DrawCard = require('../../../drawcard.js');
 
class SerJaimeLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        
        this.registerEvents(['onAttackersDeclared', 'onChallengeFinished']);
    }

    onAttackersDeclared(event, challenge) {
        var player = challenge.attackingPlayer;
        if(!this.inPlay || challenge.challengeType !== 'military') {
            return;
        }

        if(!this.isBlank()) {
            this.addKeyword('renown');
        }

        if(this.controller !== player) {
            return;
        }

        if(!this.isBlank() && player.cardsInChallenge.any(card => {
            return card.uuid === this.uuid;
        })) {
            this.kneeled = false;
        }
    }

    onChallengeFinished(event, challenge) {
        if(challenge.challengeType === 'military') {
            this.removeKeyword('renown');
        }
    }
}

SerJaimeLannister.code = '01087';

module.exports = SerJaimeLannister;
