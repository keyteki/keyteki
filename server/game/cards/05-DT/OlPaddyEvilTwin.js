import Card from '../../Card.js';

class OlPaddyEvilTwin extends Card {
    // (T) Reap: Discard the bottom card of your opponent's deck, or the bottom 3 cards instead if the tide is high. Destroy a creature that shares a house with 1 of the discarded cards.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent
                    ? context.player.opponent.deck.slice(context.player.isTideHigh() ? -3 : -1)
                    : []
            })),
            then: {
                target: {
                    cardType: 'creature',
                    controller: 'any',
                    cardCondition: (card, context) =>
                        context.preThenEvents.some((event) =>
                            card.hasHouse(event.card.printedHouse)
                        ),
                    gameAction: ability.actions.destroy()
                }
            }
        });
    }
}

OlPaddyEvilTwin.id = 'ol--paddy-evil-twin';

export default OlPaddyEvilTwin;
