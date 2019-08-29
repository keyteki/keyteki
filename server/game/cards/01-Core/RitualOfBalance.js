const Card = require('../../Card.js');

class RitualOfBalance extends Card {
    setupCardAbilities(ability) {
        this.action({
            condition: context => context.player.opponent && context.player.opponent.amber >= 6,
            gameAction: ability.actions.steal()
        });
    }
}

RitualOfBalance.id = 'ritual-of-balance';

module.exports = RitualOfBalance;
