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
            effect: 'remove {1} +1 power {2} from {0}',
            effectArgs: (context) => {
                const amount = context.target ? context.target.powerCounters : 0;
                return [amount, amount === 1 ? 'counter' : 'counters'];
            },
            then: {
                target: {
                    location: 'hand',
                    controller: 'self',
                    gameAction: ability.actions.archive()
                },
                message: '{0} uses {1} to archive a card'
            }
        });
    }
}

Klyyhnug.id = 'klyyhnug';

module.exports = Klyyhnug;
