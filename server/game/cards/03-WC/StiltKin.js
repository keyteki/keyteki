const Card = require('../../Card.js');

class StiltKin extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // After a Giant creature is played adjacent to Stilt-Kin, ready and fight with Stilt-Kin.
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
