const Card = require('../../Card.js');

class MonumentToOctavia extends Card {
    // Action: A friendly creature captures 1A. If Cornicen Octavia is in your discard pile, that creature captures 2A instead.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture((context) => ({
                    amount: context.player.discard.some((card) => card.name === 'Cornicen Octavia')
                        ? 2
                        : 1
                }))
            }
        });
    }
}

MonumentToOctavia.id = 'monument-to-octavia';

module.exports = MonumentToOctavia;
