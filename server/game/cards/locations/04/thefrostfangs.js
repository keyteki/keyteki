const DrawCard = require('../../../drawcard.js');

class TheFrostfangs extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => card === this && card.controller.phase !== 'setup'
            },
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);
                if(!otherPlayer) {
                    return;
                }

                this.game.takeControl(otherPlayer, this);

                this.game.addMessage('{0} uses {1} to give control of {1} to {2}', this.controller, this, otherPlayer);
            }
        });
    }

    getReserve() {
        if(!this.isBlank()) {
            return -1;
        }
    }
}

TheFrostfangs.code = '04098';

module.exports = TheFrostfangs;
