const Card = require('../../Card.js');

class MonumentToLudo extends Card {
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
