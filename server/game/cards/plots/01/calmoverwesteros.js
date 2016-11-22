const PlotCard = require('../../../plotcard.js');

class CalmOverWesteros extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        player.menuTitle = 'Select a challenge type';
        player.buttons = [
            { text: 'Military', command: 'plot', method: 'setChallengeType', arg: 'military' },
            { text: 'Intrigue', command: 'plot', method: 'setChallengeType', arg: 'intrigue' },
            { text: 'Power', command: 'plot', method: 'setChallengeType', arg: 'power' },
            { text: 'Cancel', command: 'plot', method: 'cancelChallengeSelect' }
        ];

        return false;
    }

    cancelChallengeSelect(player) {
        if(!this.inPlay || this.owner !== player) {
            return;
        }

        this.game.addMessage('{0} cancels the effect of {1}', player, this);
        
        this.game.playerRevealDone(player);       
    }

    setChallengeType(player, challengeType) {
        if(!this.inPlay || this.owner !== player) {
            return;
        }

        this.challengeType = challengeType;

        this.game.addMessage('{0} uses {1} to reduce the claim value of {2} challenges by 1 this round', player, this, challengeType);

        this.game.playerRevealDone(player);
    }
    
    modifyClaim(player, challengeType, claim) {
        if(!this.inPlay || player === this.owner || this.challengeType !== challengeType) {
            return claim;
        }

        return claim - 1;
    }
}

CalmOverWesteros.code = '01008';

module.exports = CalmOverWesteros;
