const Card = require('../../Card.js');

class GargantesScrapper extends Card {
    // Alpha. (You can only play this card before doing anything else this step.)
    // Play: If you have 3A or more,
    // deal 3D to an enemy creature.
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
