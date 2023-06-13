const Card = require('../../Card.js');

class BloodshardImp extends Card {
    // After a creature reaps, its controller must sacrifice it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: () => true
            },
            gameAction: ability.actions.sacrifice((context) => ({
                target: context.event.card
            }))
        });
    }
}

BloodshardImp.id = 'bloodshard-imp';

module.exports = BloodshardImp;
