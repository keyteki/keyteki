const Card = require('../../Card.js');

class Klyyhnug extends Card {
    // Enhance damage power power.
    // After Reap: You may remove each +1 power counter from a creature. If one or more counters are removed this way, archive a card.
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
