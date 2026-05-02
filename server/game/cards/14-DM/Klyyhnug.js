const Card = require('../../Card.js');

class Klyyhnug extends Card {
    // After Reap: You may remove each +1 power counter from a creature.
    // If you do, archive a card.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.removePowerCounter({ all: true })
            },
            then: {
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
