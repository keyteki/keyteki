const DrawCard = require('../../drawcard.js');

class VenerableHistorian extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor this character',
            condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this) && this.isMoreHonorableThanOpponent(),
            handler: () => {
                this.game.addMessage('{0} uses {1} to honor itself', this.controller, this);
                this.controller.honorCard(this);
            }
        });
    }
    isMoreHonorableThanOpponent() {
        let otherPlayer = this.game.getOtherPlayer(this.controller);
        if(otherPlayer && otherPlayer.honor < this.controller.honor) {
            return true;
        }
        return false;
    }
}

VenerableHistorian.id = 'venerable-historian';

module.exports = VenerableHistorian;
