const Card = require('../../Card.js');

class BurnTheStockpile extends Card {
    // Play: If your opponent has 7A or more, they lose 4A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber >= 7,
            gameAction: ability.actions.loseAmber({ amount: 4 })
        });
    }
}

BurnTheStockpile.id = 'burn-the-stockpile';

module.exports = BurnTheStockpile;
