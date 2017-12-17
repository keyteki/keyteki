const DrawCard = require('../../drawcard.js');

class WaningHostilities extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Both players may only declare 1 conflict opportunity this turn',
            when: {
                onPhaseStarted: event => event.phase === 'conflict'
            },
            handler: () => {
                this.game.addMessage('{0} plays {1} - both players may only declare a single conflict this phase', this.controller, this);
                this.controller.conflicts.conflictOpportunities = 1;
                if(this.controller.opponent) {
                    this.controller.opponent.conflicts.conflictOpportunities = 1;
                }
            }
        });
    }
}

WaningHostilities.id = 'waning-hostilities'; // This is a guess at what the id might be - please check it!!!

module.exports = WaningHostilities;
