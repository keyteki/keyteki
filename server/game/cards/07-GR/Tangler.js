const Card = require('../../Card.js');

class Tangler extends Card {
    // After Reap: Stun a creature and each of its neighbors.
    //
    // Scrap: Stun a creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.stun((context) => ({
                    target: [context.target].concat(context.target.neighbors)
                }))
            }
        });

        this.scrap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.stun()
            }
        });
    }
}

Tangler.id = 'tangler';

module.exports = Tangler;
