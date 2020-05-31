const Card = require('../../Card.js');

class RitualOfBalance extends Card {
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
