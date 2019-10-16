const Card = require('../../Card.js');

class Silvertooth extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.ready()
        });
    }
}

Silvertooth.id = 'silvertooth';

module.exports = Silvertooth;
