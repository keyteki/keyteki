const Card = require('../../Card.js');

class TechnoFiend extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.draw()
            }
        });
        this.destroyed({
            gameAction: ability.actions.steal({ amount: 1 })
        });
    }
}

TechnoFiend.id = 'techno-fiend';

module.exports = TechnoFiend;
