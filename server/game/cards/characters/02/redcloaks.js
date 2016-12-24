const DrawCard = require('../../../drawcard.js');

class RedCloaks extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared', 'onPhaseEnd']);

        this.menu.push({ text: 'Move 1 gold from your gold pool to this card', command: 'card', method: 'addGold' });

        this.tokens['gold'] = 0;
        this.usedThisPhase = false;
    }

    addGold(player) {
        if(!this.inPlay || this.controller !== player || this.usedThisPhase || player.gold <= 0) {
            return;
        }

        this.addToken('gold', 1);
        this.controller.gold--;

        this.game.addMessage('{0} moves 1 gold from their gold pool to {1}', this.controller, this);

        this.usedThisPhase = true;
    }

    onPhaseEnd() {
        this.usedThisPhase = false;
    }

    onAttackersDeclared(e, challenge) {
        if(!this.inPlay || this.controller !== challenge.attackingPlayer || challenge.challengeType !== 'intrigue') {
            return;
        }

        this.strengthModifier += this.tokens['gold'];
    }

    onChallengeFinished(e, challenge) {
        if(challenge.challengeType === 'intrigue') {
            this.strengthModifier -= this.tokens['gold'];
        }
    }
}

RedCloaks.code = '02070';

module.exports = RedCloaks;
