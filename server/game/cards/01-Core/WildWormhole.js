const Card = require('../../Card.js');

class WildWormhole extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.playCard((context) => ({
                revealOnIllegalTarget: true,
                target: context.player.deck[0]
            }))
        });
    }
}

WildWormhole.id = 'wild-wormhole';

module.exports = WildWormhole;
