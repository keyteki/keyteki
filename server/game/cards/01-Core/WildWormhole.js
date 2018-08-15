const Card = require('../../Card.js');

class WildWormhole extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'play the top card of their deck',
            gameAction: ability.actions.playCard(context => ({ target: context.player.deck[0] }))
        })
    }
}

WildWormhole.id = 'wild-wormhole'; // This is a guess at what the id might be - please check it!!!

module.exports = WildWormhole;
