const DrawCard = require('../../../drawcard.js');

class DoransGame extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        if(!this.game.currentChallenge || this.game.currentChallenge.winner !== this.controller || this.game.currentChallenge.strengthDifference < 5 ||
                this.game.currentChallenge.challengeType !== 'intrigue') {
            return false;
        }

        return true;
    }

    play(player) {
        if(this.controller !== player) {
            return;
        }

        var power = player.plotDiscard.size();

        this.game.addPower(player, power);
        this.game.addMessage('{0} uses {1} to gain {2} power for their faction', player, this, power);
    }
}

DoransGame.code = '01119';

module.exports = DoransGame;
