const Card = require('../../Card.js');

class HideawayHole extends Card {
    // Omni: Sacrifice Hideaway Hole. Creatures you control gain elusive until the start of your next turn.
    setupCardAbilities(ability) {
        this.omni({
            effect: 'give each creature they control elusive',
            effectAlert: true,
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.untilNextTurn({
                    targetController: 'current',
                    effect: ability.effects.addKeyword({ elusive: 1 })
                })
            ]
        });
    }
}

HideawayHole.id = 'hideaway-hole';

module.exports = HideawayHole;
