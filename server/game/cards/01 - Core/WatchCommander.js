const DrawCard = require('../../drawcard.js');

class WatchCommander extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: event => (
                    event.player !== this.controller && this.game.currentConflict && this.game.currentConflict.isParticipating(this.parent)
                )
            },
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);
                this.game.addHonor(opponent,-1);
                this.game.addMessage('{0} uses {1} to make {2} lose 1 honor',
                    this.controller, this, opponent);
            }
        });
    }
    canAttach(card) {
        if(card.attachments && card.attachments.any(card => card instanceof WatchCommander)) {
            return false;
        } else if(card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(card);
    }
}

WatchCommander.id = 'watch-commander';

module.exports = WatchCommander;
