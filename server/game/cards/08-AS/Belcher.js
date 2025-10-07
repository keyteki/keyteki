import Card from '../../Card.js';

function discard(deck) {
    const index = deck.findIndex((card) => card.type === 'creature');
    if (index > -1) {
        return { target: deck.slice(0, index + 1) };
    }

    return { target: deck };
}

function wasCreatureDiscarded(context) {
    return (
        context.preThenEvents.length > 0 &&
        context.preThenEvents[context.preThenEvents.length - 1].card.type === 'creature'
    );
}

class Belcher extends Card {
    // Action: Discard cards from the top of your deck until you
    // discard a creature or run out of cards. If you discarded a
    // creature this way, deal D equal to the discarded creature’s
    // power to an enemy creature.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.discard((context) => discard(context.player.deck)),
            then: {
                alwaysTriggers: true,
                condition: wasCreatureDiscarded,
                target: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount:
                            context.preThenEvents.length > 0
                                ? context.preThenEvents[
                                      context.preThenEvents.length - 1
                                  ].card.getPower()
                                : 0
                    }))
                },
                message: '{0} uses {1} to deal {3} damage to {4}',
                messageArgs: (context) => [
                    context.preThenEvents.length > 0
                        ? context.preThenEvents[context.preThenEvents.length - 1].card.getPower()
                        : 0,
                    context.target
                ]
            }
        });
    }
}

Belcher.id = 'belcher';

export default Belcher;
