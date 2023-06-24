const Card = require('../../Card.js');

class RitualOfBalance extends Card {
    // Action: If your opponent has 6<A> or more, steal 1<A>.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.opponent.amber >= 6 ? 1 : 0
            }))
        });
    }
}

RitualOfBalance.id = 'ritual-of-balance';

module.exports = RitualOfBalance;
