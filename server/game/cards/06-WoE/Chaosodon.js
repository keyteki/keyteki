const Card = require('../../Card.js');

class Chaosodon extends Card {
    setupCardAbilities(ability) {
        this.beforeFight({
            effect: "deal 3 damage to each of {1}'s neighbors",
            effectArgs: (context) => context.source,
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 3,
                target: context.source.neighbors
            }))
        });
    }
}

Chaosodon.id = 'chaosodon';

module.exports = Chaosodon;
