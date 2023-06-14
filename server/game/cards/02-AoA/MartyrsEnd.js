const Card = require('../../Card.js');

class MartyrsEnd extends Card {
    // Play: Destroy any number of friendly creatures. Gain 1A for each creature destroyed this way.
    setupCardAbilities(ability) {
        this.creaturesMartyrd = 0;
        this.play({
            effect: 'destroy {0}, and gain 1 amber for each creature destroyed this way',
            target: {
                mode: 'unlimited',
                location: ['play area'],
                cardCondition: (card) => card.type === 'creature',
                controller: 'self',
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
