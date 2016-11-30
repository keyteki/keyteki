const DrawCard = require('../../../drawcard.js');
 
class RedCloaks extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        
        this.registerEvents(['onAttackersDeclared', 'onAfterTaxation']);

        this.menu.push({ text: 'Move 1 gold from your gold pool to this card', command: 'card', method: 'addGold' });

        this.tokens['gold'] = 0;
        this.usedThisRound = false;
    }

    addGold(player) {
        if(!this.inPlay || this.owner !== player || this.usedThisRound || player.gold <= 0) {
            return;
        }
        
        this.addToken('gold', 1);
        this.owner.gold--;

        this.game.addMessage('{0} moves 1 gold from their gold pool to {1}', this.owner, this);

        this.usedThisRound = true;
    }

    onAfterTaxation() {
        // XXX this should be per phase, will change this when the new phase stuff is done and have a phase change event
        this.usedThisRound = false;
    }

    onAttackersDeclared(player, challengeType) {
        if(!this.inPlay || this.owner !== player || challengeType !== 'intrigue') {
            return;
        }

        this.strengthModifier += this.tokens['gold'];
    }

    onChallengeFinished(challengeType) {
        if(challengeType === 'intrigue') {
            this.strengthModifier -= this.tokens['gold'];
        }
    }
}

RedCloaks.code = '02070';

module.exports = RedCloaks;
