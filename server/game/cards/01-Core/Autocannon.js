const Card = require('../../Card.js');

class Autocannon extends Card {
    // Deal 1<D> to each creature after it enters play.
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
