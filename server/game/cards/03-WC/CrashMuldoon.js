const Card = require('../../Card.js');

class CrashMuldoon extends Card {
    // Deploy.
    // Crash Muldoon enters play ready.
    // Action: Use a neighboring non-Star Alliance creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayReady()
        });

        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) =>
                    context.source.neighbors.includes(card) &&
                    card.exhausted === false &&
                    !card.hasHouse('staralliance'),
                gameAction: ability.actions.use()
            },
            effect: 'use a neighboring non staralliance creature'
        });
    }
}

CrashMuldoon.id = 'crash-muldoon';

module.exports = CrashMuldoon;
