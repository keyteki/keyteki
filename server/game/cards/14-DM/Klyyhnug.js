const Card = require('../../Card.js');

class Klyyhnug extends Card {
    // After Reap: You may remove each +1 power counter from a creature.
    // If you do, archive a card.
    setupCardAbilities(ability) {
        this.reap({
            may: 'remove each +1 power counter from a creature',
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.tokens.power > 0,
                gameAction: ability.actions.removePowerCounter({ all: true })
            },
            then: {
                alwaysTriggers: true,
                target: {
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.archive()
                }
            }
        });
    }
}

Klyyhnug.id = 'klyyhnug';

module.exports = Klyyhnug;
