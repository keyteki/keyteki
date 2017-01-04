const DrawCard = require('../../../drawcard.js');

class SerJaimeLannister extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared']);
    }

    onAttackersDeclared(event, challenge) {
        var player = challenge.attackingPlayer;
        if(challenge.challengeType !== 'military') {
            return;
        }

        if(!this.isBlank()) {
            this.addKeyword('renown');
        }

        if(this.controller !== player) {
            return;
        }

        if(!this.isBlank() && challenge.isAttacking(this)) {
            this.kneeled = false;
        }

        this.game.once('onChallengeFinished', (event, challenge) => {
            this.onChallengeFinished(event, challenge);
        });
    }

    onChallengeFinished(event, challenge) {
        if(challenge.challengeType === 'military') {
            this.removeKeyword('renown');
        }
    }
}

SerJaimeLannister.code = '01087';

module.exports = SerJaimeLannister;
