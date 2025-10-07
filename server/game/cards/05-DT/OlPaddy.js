import Card from '../../Card.js';

class OlPaddy extends Card {
    // (T) Reap: Discard the bottom card of your deck, or the bottom 3 cards instead if the tide is high. Play each creature discarded this way, one at a time.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(context.player.isTideHigh() ? -3 : -1)
            })),
            then: {
                gameAction: ability.actions.sequentialForEach((context) => ({
                    forEach: context.preThenEvents
                        .filter((event) => event.card.type === 'creature')
                        .map((event) => event.card),
                    action: ability.actions.playCard()
                }))
            }
        });
    }
}

OlPaddy.id = 'ol--paddy';

export default OlPaddy;
