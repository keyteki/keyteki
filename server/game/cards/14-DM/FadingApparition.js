const Card = require('../../Card.js');

class FadingApparition extends Card {
    // Entrench.
    // While Fading Apparition is exhausted, any amber you would gain by reaping may be taken from amber among friendly creatures instead of the common supply.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onModifyAmber: (event, context) =>
                    event.reap &&
                    event.amount > 0 &&
                    event.player === context.source.controller &&
                    context.source.exhausted
            },
            condition: (context) => context.player.creaturesInPlay.some((card) => card.amber > 0),
            target: {
                optional: true,
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.amber > 0,
                gameAction: ability.actions.removeAmber({ amount: 1 })
            },
            effect: 'take 1 amber from {0} instead of the common supply',
            gameAction: ability.actions.sequential([
                ability.actions.changeEvent((context) => ({
                    event: context.event,
                    amount: 0
                })),
                ability.actions.gainAmber()
            ])
        });
    }
}

FadingApparition.id = 'fading-apparition';

module.exports = FadingApparition;
