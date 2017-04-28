const DrawCard = require('../../../drawcard.js');

class EastwatchByTheSea extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });

        this.reaction({
            when: {
                onPhaseStarted: (event, phase) => phase === 'dominance' && this.hasHigherReserveThanOpponent()
            },
            handler: () => {
                this.controller.drawCardsToHand(1);
                this.game.addMessage('{0} uses {1} to draw 1 card', this.controller, this);
            }
        });
    }

    hasHigherReserveThanOpponent() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        if(!otherPlayer) {
            return false;
        }

        return this.controller.getTotalReserve() > otherPlayer.getTotalReserve();
    }
}

EastwatchByTheSea.code = '06006';

module.exports = EastwatchByTheSea;
