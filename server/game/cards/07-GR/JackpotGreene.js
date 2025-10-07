import Card from '../../Card.js';

class JackpotGreene extends Card {
    // After a creature reaps, discard the top card of its
    // controller's deck. If the discarded card is a Star Alliance
    // card, you gain 1.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: () => true
            },
            condition: (context) => context.event.card.controller.deck.length > 0,
            gameAction: ability.actions.discard((context) => ({
                target: context.event.card.controller.deck[0]
            })),
            then: {
                condition: (context) =>
                    context.preThenEvents &&
                    context.preThenEvents.length > 0 &&
                    context.preThenEvents[0].card.hasHouse('staralliance'),
                gameAction: ability.actions.gainAmber((context) => ({
                    target: context.source.controller
                }))
            }
        });
    }
}

JackpotGreene.id = 'jackpot-greene';

export default JackpotGreene;
