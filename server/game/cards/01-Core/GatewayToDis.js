const Card = require('../../Card.js');

class GatewayToDis extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy all creatures and gain 3 chains',
            gameAction: [
                ability.actions.destroy(context => ({ target: context.game.creaturesInPlay })),
                ability.actions.gainChains({ amount: 3 })
            ]
        });
    }
}

GatewayToDis.id = 'gateway-to-dis'; // This is a guess at what the id might be - please check it!!!

module.exports = GatewayToDis;
