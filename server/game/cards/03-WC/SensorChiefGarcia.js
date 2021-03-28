const Card = require('../../Card.js');

class SensorChiefGarcia extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            effect: "increase {1}'s key cost by 2 until the end of their next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(2)
            })
        });
    }
}

SensorChiefGarcia.id = 'sensor-chief-garcia';

module.exports = SensorChiefGarcia;
