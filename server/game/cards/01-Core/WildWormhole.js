const Card = require('../../Card.js');

class WildWormhole extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.playCard((context) => ({
                revealOnIllegalTarget: true,
                revealOnIllegalTargetMessage: '{0} keeps {2} at the top of their deck',
                target: context.player.deck[0]
            }))
        });
    }
}

WildWormhole.id = 'wild-wormhole';

module.exports = WildWormhole;
