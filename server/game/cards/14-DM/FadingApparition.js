const Card = require('../../Card.js');

class FadingApparition extends Card {
    // Entrench.
    // While Fading Apparition is exhausted, any amber you would gain by reaping may be taken from amber among friendly creatures instead of the common supply.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onModifyAmber: (event, context) =>
                    event.reap &&
                    !event.amberSourceChosen &&
                    event.player === context.source.controller &&
                    context.source.exhausted
            },
            condition: (context) => context.player.creaturesInPlay.some((card) => card.amber > 0),
            target: {
                optional: true,
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.amber > 0,
                gameAction: [
                    ability.actions.removeAmber({ amount: 1 }),
                    // Other copies don't stack: once amber is taken, this reap's source is decided
                    ability.actions.changeEvent((context) => ({
                        event: context.event,
                        amberSourceChosen: true
                    }))
                ]
            },
            effect: 'take 1 amber from {0} instead of the common supply'
        });
    }
}

FadingApparition.id = 'fading-apparition';

module.exports = FadingApparition;
