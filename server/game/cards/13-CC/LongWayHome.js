const Card = require('../../Card.js');

class LongWayHome extends Card {
    // Play: Archive each friendly Skyborn creature from play.
    setupCardAbilities(ability) {
        this.play({
            effect: 'archive each friendly Skyborn creature',
            gameAction: ability.actions.archive((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) => card.hasHouse('skyborn') && card.controller === context.player
                )
            }))
        });
    }
}

LongWayHome.id = 'long-way-home';

module.exports = LongWayHome;
