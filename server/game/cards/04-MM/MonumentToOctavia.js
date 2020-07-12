const Card = require('../../Card.js');

class MonumentToOctavia extends Card {
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
