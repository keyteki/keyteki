const Card = require('../../Card.js');

class BellowingPatrizate extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card.type === 'creature' && !this.exhausted
            },
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 1,
                target: context.event.card
            }))
        });
    }
}

BellowingPatrizate.id = 'bellowing-patrizate';

module.exports = BellowingPatrizate;
