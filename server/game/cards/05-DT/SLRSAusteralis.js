import Card from '../../Card.js';

class SLRSAusteralis extends Card {
    // Action: Exhaust up to 3 friendly Logos creatures. For each creature exhausted this way, play the top card of your deck, one at a time.
    setupCardAbilities(ability) {
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

export default SLRSAusteralis;
