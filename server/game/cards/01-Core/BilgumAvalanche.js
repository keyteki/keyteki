const Card = require('../../Card.js');

class BilgumAvalanche extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onForgeKey: (event, context) =>
                    event.player === context.player && !!context.player.opponent
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 2,
                target: context.player.opponent.creaturesInPlay
            }))
        });
    }
}

BilgumAvalanche.id = 'bilgum-avalanche';

module.exports = BilgumAvalanche;
