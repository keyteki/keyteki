const Card = require('../../Card.js');

class MonumentToLudo extends Card {
    // Action: Move 1A from a creature to the common supply. If Praefectus Ludo is in your discard pile, move 2A from that creature to the common supply instead.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.removeAmber((context) => ({
                    amount: context.player.discard.some((card) => card.name === 'Praefectus Ludo')
                        ? 2
                        : 1
                }))
            }
        });
    }
}

MonumentToLudo.id = 'monument-to-ludo';

module.exports = MonumentToLudo;
