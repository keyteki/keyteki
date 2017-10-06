const DrawCard = require('../../drawcard.js');

class CaptiveAudience extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            cost: ability.costs.payHonor(1),
            clickToActivate: true,
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'political',
            handler: () => {
                this.game.addMessage('{0} uses {1} to switch the conflict type to military', this.controller, this);
                this.game.currentConflict.switchType();
            }
        });
    }
}

CaptiveAudience.id = 'captive-audience';

module.exports = CaptiveAudience;
