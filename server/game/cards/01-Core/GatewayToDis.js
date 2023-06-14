const Card = require('../../Card.js');

class GatewayToDis extends Card {
    // Play: Destroy each creature. Gain 3 chains.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy all creatures and gain 3 chains',
            gameAction: [
                ability.actions.destroy((context) => ({ target: context.game.creaturesInPlay })),
                ability.actions.gainChains({ amount: 3 })
            ]
        });
    }
}

GatewayToDis.id = 'gateway-to-dis';

module.exports = GatewayToDis;
