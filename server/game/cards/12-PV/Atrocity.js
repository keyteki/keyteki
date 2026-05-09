const Card = require('../../Card.js');

class Atrocity extends Card {
    // Play: At the start of your opponent's next turn, that player discards
    // the top card of their deck. They must choose the discarded card's
    // house as their active house this turn.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: "force {1} to discard and choose that card's house next turn",
            effectArgs: (context) => context.player.opponent,
            effectAlert: true,
            gameAction: ability.actions.duringOpponentNextTurn({
                when: {
                    onTurnStart: () => true
                },
                multipleTrigger: false,
                gameAction: ability.actions.discard((context) => ({
                    target: context.player.opponent ? context.player.opponent.deck.slice(0, 1) : []
                })),
                message: '{0} uses {1} to discard {3} from the top of their deck',
                messageArgs: (context) => [
                    context.player,
                    context.source,
                    context.player.opponent && context.player.opponent.deck.length > 0
                        ? context.player.opponent.deck[0]
                        : 'nothing'
                ],
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.untilPlayerTurnEnd((context) => ({
                        targetController: 'opponent',
                        effect: ability.effects.restrictHouseChoice(
                            context.preThenEvents.length > 0 && context.preThenEvents[0].card
                                ? context.preThenEvents[0].card.getHouses()
                                : []
                        )
                    }))
                }
            })
        });
    }
}

Atrocity.id = 'atrocity';

module.exports = Atrocity;
