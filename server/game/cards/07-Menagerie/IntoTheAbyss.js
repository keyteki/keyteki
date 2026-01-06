const Card = require('../../Card.js');

class IntoTheAbyss extends Card {
    // Play: Your opponent discards their hand and draws 4 cards.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent ? context.player.opponent.hand : []
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.draw((context) => ({
                    target: context.player.opponent,
                    amount: 4
                }))
            }
        });
    }
}

IntoTheAbyss.id = 'into-the-abyss';

module.exports = IntoTheAbyss;
