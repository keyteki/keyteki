const DrawCard = require('../../../drawcard.js');

class SerWaymarRoyce extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, player, card) => {
                    if(card !== this || player !== card.controller) {
                        return false;
                    }

                    return true;
                }
            },
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);
                if(!otherPlayer) {
                    return;
                }

                this.game.addMessage('{0} uses {1} to 1 card at random from {2}\'s hand', this.controller, this, otherPlayer);
                otherPlayer.discardAtRandom(1);
            }
        });
    }
}

SerWaymarRoyce.code = '01128';

module.exports = SerWaymarRoyce;
