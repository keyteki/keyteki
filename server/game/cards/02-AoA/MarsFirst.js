const Card = require('../../Card.js');

class MarsFirst extends Card {
    // Play: Ready and use a friendly Mars creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardCondition: (card) => card.hasHouse('mars'),
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            },
            effect: 'ready and use {0}'
        });
    }
}

MarsFirst.id = 'mars-first';

module.exports = MarsFirst;
