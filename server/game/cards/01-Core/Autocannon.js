const Card = require('../../Card.js');

class Autocannon extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card.type === 'creature'
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.event.card
            }))
        });
    }
}

Autocannon.id = 'autocannon';

module.exports = Autocannon;
