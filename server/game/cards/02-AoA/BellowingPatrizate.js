const Card = require('../../Card.js');

class BellowingPatrizate extends Card {
    // While Bellowing Patrizate is ready, each creature takes 1D after it enters play.
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
