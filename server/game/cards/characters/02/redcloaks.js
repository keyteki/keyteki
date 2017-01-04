const DrawCard = require('../../../drawcard.js');

class RedCloaks extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onAttackersDeclared']);

        this.tokens['gold'] = 0;
    }

    setupCardAbilities() {
        this.action({
            title: 'Move 1 gold from your gold pool to this card',
            method: 'addGold',
            limit: { amount: 1, period: 'phase' }
        });
    }

    addGold(player) {
        if(this.location !== 'play area' || player.gold <= 0) {
            return false;
        }

        this.addToken('gold', 1);
        this.controller.gold--;

        this.game.addMessage('{0} moves 1 gold from their gold pool to {1}', this.controller, this);
    }

    onAttackersDeclared(e, challenge) {
        if(this.location !== 'play area' || this.controller !== challenge.attackingPlayer || challenge.challengeType !== 'intrigue') {
            return;
        }

        this.strengthModifier += this.tokens['gold'];

        this.game.once('onChallengeFinished', (e, challenge) => {
            this.onChallengeFinished(e, challenge);
        });
    }

    onChallengeFinished(e, challenge) {
        if(challenge.challengeType === 'intrigue') {
            this.strengthModifier -= this.tokens['gold'];
        }
    }
}

RedCloaks.code = '02070';

module.exports = RedCloaks;
