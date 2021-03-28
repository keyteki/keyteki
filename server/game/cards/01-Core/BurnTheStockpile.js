const Card = require('../../Card.js');

class BurnTheStockpile extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber >= 7,
            gameAction: ability.actions.loseAmber({ amount: 4 })
        });
    }
}

BurnTheStockpile.id = 'burn-the-stockpile';

module.exports = BurnTheStockpile;
