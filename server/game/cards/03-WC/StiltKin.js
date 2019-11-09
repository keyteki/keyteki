const Card = require('../../Card.js');

class StiltKin extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event) => event.card.type === 'creature' && this.neighbors.includes(event.card) && event.card.hasTrait('giant')
            },
            gameAction: ability.actions.sequential([ability.actions.ready(),ability.actions.fight()])
        });
    }
}

StiltKin.id = 'stilt-kin';

module.exports = StiltKin;
