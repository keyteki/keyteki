const _ = require('underscore');
const Card = require('../../Card.js');

class SabotageMission extends Card {
    setupCardAbilities(ability) {
        // Play: During your opponent's next turn, keys cost +1 for each different power value of friendly creatures.
        this.play({
            effect:
                "increase {1}'s key cost by 1 for each different power value of friendly creatures",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(
                    (context) =>
                        _.uniq(context.player.creaturesInPlay.map((card) => card.power)).length
                )
            })
        });
    }
}

SabotageMission.id = 'sabotage-mission';

module.exports = SabotageMission;
