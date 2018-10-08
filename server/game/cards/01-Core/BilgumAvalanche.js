const Card = require('../../Card.js');

class BilgumAvalanche extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onForgeKey: (event, context) => event.player === context.player && !!context.player.opponent
            },
            gameAction: ability.actions.dealDamage(context => ({
                amount: 2,
                target: context.player.opponent.creaturesInPlay
            }))
        });
    }
}

BilgumAvalanche.id = 'bilgum-avalanche'; // This is a guess at what the id might be - please check it!!!

module.exports = BilgumAvalanche;
