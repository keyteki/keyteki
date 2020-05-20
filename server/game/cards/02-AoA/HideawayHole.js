const Card = require('../../Card.js');

class HideawayHole extends Card {
    setupCardAbilities(ability) {
        this.omni({
            effect: 'give each creature they control elusive',
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.cardLastingEffect((context) => ({
                    duration: 'untilNextTurn',
                    target: context.player.creaturesInPlay,
                    effect: ability.effects.addKeyword({ elusive: 1 })
                }))
            ]
        });
    }
}

HideawayHole.id = 'hideaway-hole';

module.exports = HideawayHole;
