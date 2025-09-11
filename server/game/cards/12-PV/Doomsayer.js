const Card = require('../../Card.js');

class Doomsayer extends Card {
    // After Reap: Move each A from a friendly creature to the common supply. For each A moved, deal 2D to a creature.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'move amber from friendly creatures to the common supply and deal damage',
            target: {
                controller: 'self',
                location: 'play area',
                cardType: 'creature',
                gameAction: ability.actions.removeAmber({
                    all: true
                })
            },
            then: {
                gameAction: ability.actions.allocateDamage((context) => ({
                    damageStep: 2,
                    numSteps: context.preThenEvent.amount
                }))
            }
        });
    }
}

Doomsayer.id = 'doomsayer';

module.exports = Doomsayer;
