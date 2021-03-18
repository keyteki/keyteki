const Card = require('../../Card.js');

class OldEgad extends Card {
    //Destroyed: Ward each of $this's neighbors.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.ward((context) => ({
                target: context.source.neighbors
            }))
        });
    }
}

OldEgad.id = 'old-egad';

module.exports = OldEgad;
