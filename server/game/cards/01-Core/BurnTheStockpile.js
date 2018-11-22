const Card = require('../../Card.js');

class BurnTheStockpile extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.opponent && context.player.opponent.amber >= 7,
            gameAction: ability.actions.loseAmber({ amount: 4 })
        });
    }
}

BurnTheStockpile.id = 'burn-the-stockpile'; // This is a guess at what the id might be - please check it!!!

module.exports = BurnTheStockpile;
