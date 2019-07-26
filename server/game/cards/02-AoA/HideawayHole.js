const Card = require('../../Card.js');

class HideawayHole extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: 'give each creature you control elusive',
            gameAction: ability.actions.forRemainderOfTurn({
                targetController: 'current',
                effect: ability.effects.removeKeyword('elusive')
            })
        });
    }
}

HideawayHole.id = 'hideaway-hole';

module.exports = HideawayHole;
