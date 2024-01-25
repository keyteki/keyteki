const Card = require('../../Card.js');

class Touchstone extends Card {
    // After Reap: If you are haunted, draw 2 cards. Otherwise, discard the
    // top 2 cards of your deck.
    setupCardAbilities(ability) {
        this.reap({
            effectStyle: 'all',
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.isHaunted(),
                trueGameAction: ability.actions.draw({ amount: 2 }),
                falseGameAction: ability.actions.discard((context) => ({
                    target: context.player.deck.slice(0, 2)
                }))
            }),
            effect: '{1}',
            effectArgs: (context) => [
                context.player.isHaunted() ? 'draw 2 cards' : 'discard 2 cards from their deck'
            ]
        });
    }
}

Touchstone.id = 'touchstone';

module.exports = Touchstone;
