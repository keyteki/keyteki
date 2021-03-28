const Card = require('../../Card.js');

class ChaosPortal extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'house'
            },
            effect: 'choose {1} and reveal {2}',
            effectArgs: (context) => [context.house, context.player.deck[0]],
            gameAction: ability.actions.playCard((context) => ({
                target:
                    context.player.deck.length && context.player.deck[0].hasHouse(context.house)
                        ? context.player.deck[0]
                        : []
            }))
        });
    }
}

ChaosPortal.id = 'chaos-portal';

module.exports = ChaosPortal;
