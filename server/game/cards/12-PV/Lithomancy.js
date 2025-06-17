const Card = require('../../Card.js');

class Lithomancy extends Card {
    // Action: Reveal the top card of your deck. If the revealed card belongs to the active house, discard it and gain 2 amber.
    setupCardAbilities(ability) {
        this.action({
            effect: 'reveal {1}',
            condition: (context) => context.player.deck.length > 0,
            effectArgs: (context) => context.player.deck[0],
            gameAction: ability.actions.reveal((context) => ({
                target: context.player.deck.length > 0 ? context.player.deck[0] : [],
                chatMessage: true
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) =>
                    context.player.deck.length > 0 &&
                    context.player.deck[0].hasHouse(context.player.activeHouse),
                gameAction: ability.actions.gainAmber({ amount: 2 }),
                message: '{0} uses {1} to gain 2 amber',
                messageArgs: (context) => [context.player, context.source]
            }
        });
    }
}

Lithomancy.id = 'lithomancy';

module.exports = Lithomancy;
