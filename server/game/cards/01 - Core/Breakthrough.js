const DrawCard = require('../../drawcard.js');

class Breakthrough extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onConflictFinished: event => {
                    return (event.conflict.conflictProvince &&
                            event.conflict.conflictProvince.isBroken && 
                            event.conflict.winner === this.controller &&
                            this.controller.conflicts.conflictOpportunities > 0);
                }
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} to move straight to their next conflict!', this.controller, this);
                context.event.conflict.winnerGoesStraightToNextConflict = true;
            } 
        });
    }
}

Breakthrough.id = 'breakthrough';

module.exports = Breakthrough;
