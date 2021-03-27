const Card = require('../../Card.js');

class SLRSAusteralis extends Card {
    setupCardAbilities(ability) {
        // Action: Exhaust up to 3 friendly Logos creatures. For each creature exhausted this way, play the top card of your deck, one at a time.
        this.action({
            target: {
                numCards: 3,
                mode: 'upTo',
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.hasHouse('logos'),
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.preThenEvents.some((event) => !event.cancelled),
                gameAction: ability.actions.sequentialForEach((context) => ({
                    num: context.preThenEvents.filter((event) => !event.cancelled).length,
                    action: ability.actions.playCard((context) => ({
                        revealOnIllegalTarget: true,
                        target: context.player.deck[0]
                    }))
                }))
            }
        });
    }
}

SLRSAusteralis.id = 'slrs-austeralis';

module.exports = SLRSAusteralis;
