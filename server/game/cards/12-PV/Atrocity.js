const Card = require('../../Card.js');

class Atrocity extends Card {
    // At the start of your opponent's turn, that player discards
    // the top card of their deck. They must choose the discarded card's
    // house as their active house this turn. Deal 1 damage to Atrocity.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (_, context) =>
                    context.source.controller.opponent === context.game.activePlayer
            },
            gameAction: [
                ability.actions.discard((context) => ({
                    target: context.source.controller.opponent
                        ? context.source.controller.opponent.deck.slice(0, 1)
                        : []
                })),
                ability.actions.dealDamage((context) => ({
                    amount: 1,
                    target: context.source
                }))
            ],
            effect: 'discard {1} from their deck and deal 1 damage to {0}',
            effectArgs: (context) => [
                context.source.controller.opponent &&
                context.source.controller.opponent.deck.length > 0
                    ? context.source.controller.opponent.deck.slice(0, 1)
                    : 'nothing'
            ],
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.untilNextTurn((context) => ({
                    target: context.source.controller.opponent,
                    effect: ability.effects.restrictHouseChoice(
                        context.preThenEvents.length > 1 && context.preThenEvents[0].card
                            ? context.preThenEvents[0].card.getHouses()
                            : []
                    )
                }))
            }
        });
    }
}

Atrocity.id = 'atrocity';

module.exports = Atrocity;
