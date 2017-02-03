const DrawCard = require('../../../drawcard.js');

class RelentlessAssault extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }
        if(!this.game.currentChallenge || this.game.currentChallenge.winner !== this.controller ||
                this.game.currentChallenge.strengthDifference < 5 || player.faction.kneeled) {
            return false;
        }
        return true;
    }

    play(player) {
        if(this.controller !== player) {
            return;
        }
        player.kneelCard(player.faction);
        var type = this.game.currentChallenge.challengeType;
        this.untilEndOfPhase(ability => ({
            targetType: 'player',
            targetController: 'current',
            effect: ability.effects.modifyChallengeTypeLimit(type, 1)
        }));
    }
}

RelentlessAssault.code = '04118';

module.exports = RelentlessAssault;
