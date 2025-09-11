const Card = require('../../Card.js');

class JunkRestoration extends Card {
    // Play: Discard the top 3 cards of your deck. You may put a card
    // discarded this way into your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(0, 3)
            })),
            then: {
                target: {
                    controller: 'self',
                    location: 'discard',
                    optional: true,
                    cardCondition: (card, context) =>
                        context.preThenEvents
                            .filter((e) => !!e.card)
                            .map((e) => e.card)
                            .includes(card),
                    gameAction: ability.actions.returnToHand({
                        location: 'discard'
                    })
                },
                message: '{0} uses {1} to return {3} to hand',
                messageArgs: (context) => [context.target]
            }
        });
    }
}

JunkRestoration.id = 'junk-restoration';

module.exports = JunkRestoration;
