const DrawCard = require('../../drawcard.js');

class KaiuShuichi extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain 1 fate',
            condition: () => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);
                return (
                    this.game.currentConflict && 
                    this.game.currentConflict.isParticipating(this) && 
                    (this.controller.getNumberOfHoldingsInPlay() > 0 ||
                    (otherPlayer && otherPlayer.getNumberOfHoldingsInPlay() > 0))
                ); 
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain 1 fate', this.controller, this);
                this.game.addFate(this.controller, 1);
            } 
        });
    }
}

KaiuShuichi.id = 'kaiu-shuichi';

module.exports = KaiuShuichi;
