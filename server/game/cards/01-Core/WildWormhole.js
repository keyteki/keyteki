const Card = require('../../Card.js');

class WildWormhole extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'play the top card of their deck{1}{2}',
            effectArgs: (context) =>
                context.player.deck.length &&
                context.player.checkRestrictions('play', context.game.getFrameworkContext())
                    ? [': ', context.player.deck[0]]
                    : [],
            gameAction: [
                ability.actions.reveal((context) => ({
                    location: 'deck',
                    chatMessage: true,
                    target:
                        (context.player.deck.length &&
                            context.player.deck[0].hasKeyword('alpha')) ||
                        !context.player.checkRestrictions(
                            'play',
                            context.game.getFrameworkContext()
                        )
                            ? context.player.deck[0]
                            : []
                })),
                ability.actions.playCard((context) => ({ target: context.player.deck[0] }))
            ]
        });
    }
}

WildWormhole.id = 'wild-wormhole';

module.exports = WildWormhole;
