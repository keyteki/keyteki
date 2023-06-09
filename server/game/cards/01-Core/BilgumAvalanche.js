const Card = require('../../Card.js');

class BilgumAvalanche extends Card {
    // After you forge a key, deal 2D to each enemy creature.
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
