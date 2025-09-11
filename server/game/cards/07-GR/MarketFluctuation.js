const Card = require('../../Card.js');

class MarketFluctuation extends Card {
    // Play: Each haunted player draws 3 cards. Each player that is
    // not haunted discards 3 random cards from their hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.draw((context) => ({
                    target: [context.player, context.player.opponent].filter(
                        (p) => p && p.isHaunted()
                    ),
                    amount: 3
                })),
                ability.actions.discardAtRandom((context) => ({
                    target: [context.player, context.player.opponent].filter(
                        (p) => p && !p.isHaunted()
                    ),
                    amount: 3
                }))
            ])
        });
    }
}

MarketFluctuation.id = 'market-fluctuation';

module.exports = MarketFluctuation;
