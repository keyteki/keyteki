const Card = require('../../Card.js');

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

function playLastDiscardedCardAndDestroyNeighbors(ability) {
    return ability.actions.sequential([
        ability.actions.putIntoPlay((context) => ({
            target:
                context.preThenEvents.length > 0
                    ? context.preThenEvents[context.preThenEvents.length - 1].card
                    : []
        })),
        ability.actions.destroy((context) => ({
            promptForSelect: {
                activePromptTitle: 'Choose a creature to destroy',
                cardCondition: (c) =>
                    context.preThenEvents[context.preThenEvents.length - 1].card.neighbors.includes(
                        c
                    ),
                message: '{0} uses {1} to destroy {2}',
                messageArgs: (card) => [context.player, context.source, card]
            }
        }))
    ]);
}

function putIntoPlayMessageArgs(context, player) {
    return [
        wasCreatureDiscarded(context)
            ? 'put ' +
              context.preThenEvents[context.preThenEvents.length - 1].card.name +
              ' into play for ' +
              player.name
            : 'do nothing for ' + player.name
    ];
}

class AberrantWarpEvent extends Card {
    // Play: Discard cards from the top of your deck until you discard a
    // creature or run out of cards. If you discard a creature this way, put it
    // into play and destroy one of its neighbors. Repeat the preceding effect
    // on your opponent.
    setupCardAbilities(ability) {
        this.play({
            // Self discard
            gameAction: ability.actions.discard((context) => discard(context.player.deck)),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.conditional({
                    condition: wasCreatureDiscarded,
                    trueGameAction: playLastDiscardedCardAndDestroyNeighbors(ability)
                }),
                message: '{0} uses {1} to {3}',
                messageArgs: (context) => putIntoPlayMessageArgs(context, context.player),
                then: {
                    alwaysTriggers: true,
                    condition: (context) =>
                        !!context.player.opponent && context.player.opponent.deck.length > 0,
                    gameAction: ability.actions.discard((context) =>
                        discard(context.player.opponent ? context.player.opponent.deck : [])
                    ),
                    then: {
                        condition: wasCreatureDiscarded,
                        gameAction: playLastDiscardedCardAndDestroyNeighbors(ability),
                        message: '{0} uses {1} to {3}',
                        messageArgs: (context) =>
                            putIntoPlayMessageArgs(context, context.player.opponent)
                    }
                }
            }
        });
    }
}

AberrantWarpEvent.id = 'aberrant-warp-event';

module.exports = AberrantWarpEvent;
