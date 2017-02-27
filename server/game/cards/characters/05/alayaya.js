const DrawCard = require('../../../drawcard.js');

class Alayaya extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) => (
                    challenge.winner === this.controller && 
                    challenge.isParticipating(this) && 
                    this.opponentHasGold())
            },
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);

                this.game.addGold(otherPlayer, -1);
                this.game.addGold(this.controller, 1);
                this.game.addMessage('{0} uses {1} to move 1 gold from {2}\'s gold pool to their own', this.controller, this, otherPlayer);
            }
        });
    }

    opponentHasGold() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer) {
            return false;
        }

        return otherPlayer.gold >= 1;
    }
}

Alayaya.code = '05013';

module.exports = Alayaya;
