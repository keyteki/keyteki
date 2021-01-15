const Card = require('../../Card.js');

class TheChosenOne extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCardsReadied: (event, context) =>
                    event.player === context.source.controller.opponent
            },
            gameAction: [
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    cancel: true
                })),
                ability.actions.dealDamage((context) => ({
                    amount: context.event.player.creaturesInPlay.filter((card) => card.exhausted)
                        .length
                }))
            ],
            effect: "skip {1}'s ready cards and deal {2} damage to {0}",
            effectArgs: (context) => [
                context.event.player,
                context.event.player.creaturesInPlay.filter((card) => card.exhausted).length
            ]
        });
    }
}

TheChosenOne.id = 'the-chosen-one';

module.exports = TheChosenOne;
