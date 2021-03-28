const Card = require('../../Card.js');

class MartyrsEnd extends Card {
    setupCardAbilities(ability) {
        this.creaturesMartyrd = 0;
        this.play({
            effect:
                'destroy any number of friendly creatures. gain 1 amber for each creature destroyed this way.',
            target: {
                mode: 'unlimited',
                location: ['play area'],
                cardCondition: (card) => card.type === 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.destroy(),
                    ability.actions.gainAmber((context) => ({
                        target: context.player,
                        amount: context.target.length
                    }))
                ])
            }
        });
    }
}

MartyrsEnd.id = 'martyr-s-end';

module.exports = MartyrsEnd;
