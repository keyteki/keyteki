const Card = require('../../Card.js');

class GargantesScrapper extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.amber >= 3,
            gameAction: ability.actions.dealDamage(context => ({
                amount: 3,
                target: context.game.creaturesInPlay.filter(card => card.controller !== context.player)
            }))
        });
    }
}

GargantesScrapper.id = 'gargantes-scrapper';

module.exports = GargantesScrapper;
