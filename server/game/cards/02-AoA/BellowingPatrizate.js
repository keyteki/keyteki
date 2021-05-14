const Card = require('../../Card.js');

class BellowingPatrizate extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.type === 'creature' && !context.source.exhausted
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
