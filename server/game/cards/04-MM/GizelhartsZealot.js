const Card = require('../../Card.js');

class GizelhartsZealot extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: [
                ability.actions.ready(),
                ability.actions.enrage()
            ]
        });
    }
}

GizelhartsZealot.id = 'gizelhart-s-zealot';

module.exports = GizelhartsZealot;
