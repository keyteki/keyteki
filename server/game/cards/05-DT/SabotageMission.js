const _ = require('underscore');
const Card = require('../../Card.js');

class SabotageMission extends Card {
    // Play: Keys cost +1A for each different power value among friendly creatures during your opponent’s next turn.
    setupCardAbilities(ability) {
        this.play({
            effect: "increase key cost by 1 for each friendly creature during {1}'s next turn",
            effectArgs: (context) => [context.player.opponent],
            gameAction: ability.actions.duringOpponentNextTurn((context) => ({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(
                    () => _.uniq(context.player.creaturesInPlay.map((card) => card.power)).length
                )
            }))
        });
    }
}

SabotageMission.id = 'sabotage-mission';

module.exports = SabotageMission;
