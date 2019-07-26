const Card = require('../../Card.js');

class TheCurator extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'artifact' && event.card.controller === context.player
            },
            gameAction: ability.actions.ready(context => ({ target: context.event.card }))
        });
    }
}

TheCurator.id = 'the-curator';

module.exports = TheCurator;
