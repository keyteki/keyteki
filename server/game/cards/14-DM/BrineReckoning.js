const Card = require('../../Card.js');

class BrineReckoning extends Card {
    // Play: Each player discards the top 5 cards of their deck.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                location: 'deck',
                target: [
                    ...context.player.deck.slice(0, Math.min(context.player.deck.length, 5)),
                    ...(context.player.opponent
                        ? context.player.opponent.deck.slice(
                              0,
                              Math.min(context.player.opponent.deck.length, 5)
                          )
                        : [])
                ]
            }))
        });
    }
}

BrineReckoning.id = 'brine-reckoning';

module.exports = BrineReckoning;
