const DrawCard = require('../../../drawcard.js');

class SerColenOfGreenpools extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared', 'onDefendersDeclared', 'onChallengeFinished']);
    }

    onAttackersDeclared(event, challenge) {
        if(challenge.challengeType !== 'power' || challenge.attackingPlayer !== this.controller || this.isBlank()) {
            return;
        }

        this.strengthModifier += 3;
        
        this.strengthBoosted = true;

        this.game.addMessage('{0} uses {1} to gain +3 STR on {1} for the duration of this {2} challenge', this.controller, this, challenge.challengeType);
    }

    onDefendersDeclared(event, challenge) {
        if(challenge.challengeType !== 'power' || challenge.defendingPlayer !== this.controller || this.isBlank()) {
            return;
        }

        this.strengthModifier += 3;
        
        this.strengthBoosted = true;

        this.game.addMessage('{0} uses {1} to gain +3 STR on {1} for the duration of this {2} challenge', this.controller, this, challenge.challengeType);
    }

    onChallengeFinished() {
        if(this.strengthBoosted) {
            this.strengthModifier -= 3;

            this.strengthBoosted = false;
        }
    }
}

SerColenOfGreenpools.code = '04004';

module.exports = SerColenOfGreenpools;
