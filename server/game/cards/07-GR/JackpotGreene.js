const Card = require('../../Card.js');

class JackpotGreene extends Card {
    // After a creature reaps, discard the top card of its
    // controller's deck. If the discarded card is a Star Alliance
    // card, you gain 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('reap', {
                condition: (context) => context.source.controller.deck.length > 0,
                gameAction: ability.actions.discard((context) => ({
                    target: context.source.controller.deck[0]
                })),
                then: {
                    condition: (context) =>
                        context.preThenEvents &&
                        context.preThenEvents.length > 0 &&
                        context.preThenEvents[0].card.hasHouse('staralliance'),
                    gameAction: ability.actions.gainAmber({
                        target: this.controller
                    })
                }
            })
        });
    }
}

JackpotGreene.id = 'jackpot-greene';

module.exports = JackpotGreene;
