const Card = require('../../Card.js');

class MartyrsEnd extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect:
                'destroy any number of friendly creatures. gain 1 amber for each creature destroyed this way.',
            target: {
                mode: 'unlimited',
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.destroy()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvents.filter((event) => !event.cancelled).length
                }))
            }
        });
    }
}

MartyrsEnd.id = 'martyr-s-end';

module.exports = MartyrsEnd;
