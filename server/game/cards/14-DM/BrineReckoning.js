const Card = require('../../Card.js');

class BrineReckoning extends Card {
    // Play: Each player discards the top 5 cards of their deck.
    setupCardAbilities(ability) {
        this.play({
            effectStyle: 'all',
            gameAction: [
                ability.actions.discardTopOfDeck((context) => ({
                    target: context.player,
                    amount: 5
                })),
                ability.actions.discardTopOfDeck((context) => ({
                    target: context.player.opponent,
                    amount: 5
                }))
            ]
        });
    }
}

BrineReckoning.id = 'brine-reckoning';

module.exports = BrineReckoning;
