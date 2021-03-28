const Card = require('../../Card.js');

class JohnSmyth extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                cardCondition: (card) => !card.hasTrait('agent') && card.hasHouse('mars'),
                gameAction: ability.actions.ready()
            }
        });
    }
}

JohnSmyth.id = 'john-smyth';

module.exports = JohnSmyth;
