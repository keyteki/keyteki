const Card = require('../../Card.js');

class TheChosenOne extends Card {
    // Instead of readying creatures they control during their “ready cards” step, your opponent deals 1D to The Chosen One for each exhausted creature they control.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardsReadied: (event, context) => event.player === context.player.opponent
            },
            gameAction: [
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    cancel: true
                })),
                ability.actions.dealDamage((context) => ({
                    amount: context.player.opponent.creaturesInPlay.filter((card) => card.exhausted)
                        .length
                }))
            ],
            effect: "skip {1}'s ready cards and deal {2} damage to {0}",
            effectArgs: (context) => [
                context.player.opponent,
                context.player.opponent.creaturesInPlay.filter((card) => card.exhausted).length
            ]
        });
    }
}

TheChosenOne.id = 'the-chosen-one';

module.exports = TheChosenOne;
