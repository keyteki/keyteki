const _ = require('underscore');
const Card = require('../../Card.js');

class SabotageMission extends Card {
    // Play: Keys cost +1A for each different power value among friendly creatures during your opponent’s next turn.
    setupCardAbilities(ability) {
        this.play({
            effect:
                "increase {1}'s key cost by 1 for each different power value of friendly creatures",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost((player) =>
                    player.opponent
                        ? _.uniq(player.opponent.creaturesInPlay.map((card) => card.power)).length
                        : 0
                )
            })
        });
    }
}

SabotageMission.id = 'sabotage-mission';

module.exports = SabotageMission;
