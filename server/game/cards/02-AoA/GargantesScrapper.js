const Card = require('../../Card.js');

class GargantesScrapper extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.amber >= 3,
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 3 })
            }
        });
    }
}

GargantesScrapper.id = 'gargantes-scrapper';

module.exports = GargantesScrapper;
