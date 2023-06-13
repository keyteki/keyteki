const Card = require('../../Card.js');

class Tremor extends Card {
    // Play: Stun a creature and each of its neighbors.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.stun((context) => ({
                    target: context.target.neighbors.concat(context.target)
                }))
            }
        });
    }
}

Tremor.id = 'tremor';

module.exports = Tremor;
