const Card = require('../../Card.js');

class SwiftCurrent extends Card {
    // Action: Each friendly Tentacle captures 1.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.capture((context) => ({
                target: context.player.creaturesInPlay.filter((card) => card.hasTrait('tentacle')),
                amount: 1
            }))
        });
    }
}

SwiftCurrent.id = 'swift-current';

module.exports = SwiftCurrent;
