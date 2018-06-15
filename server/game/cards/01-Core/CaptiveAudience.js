const DrawCard = require('../../drawcard.js');

class CaptiveAudience extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Change the conflict to military',
            cost: ability.costs.payHonor(1),
            condition: () => this.game.isDuringConflict('political'),
            effect: 'switch the conflict type to {1}',
            effectArgs: () => 'military',
            handler: () => this.game.currentConflict.switchType()
        });
    }
}

CaptiveAudience.id = 'captive-audience';

module.exports = CaptiveAudience;
