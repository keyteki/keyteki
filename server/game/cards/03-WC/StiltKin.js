const Card = require('../../Card.js');

class StiltKin extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'creature' &&
                    context.source.neighbors.includes(event.card) &&
                    event.card.hasTrait('giant')
            },
            gameAction: ability.actions.sequential([
                ability.actions.ready(),
                ability.actions.fight()
            ]),
            effect: 'ready and fight with {0}'
        });
    }
}

StiltKin.id = 'stilt-kin';

module.exports = StiltKin;
