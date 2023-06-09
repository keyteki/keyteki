const Card = require('../../Card.js');

class TakeThatSmartypants extends Card {
    // Play: Steal 2A if your opponent has 3or more Logos cards in play.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent &&
                context.player.opponent.cardsInPlay.reduce(
                    (total, card) =>
                        total +
                        card.upgrades.concat(card).filter((c) => c.hasHouse('logos')).length,
                    0
                ) >= 3,
            gameAction: ability.actions.steal({ amount: 2 })
        });
    }
}

TakeThatSmartypants.id = 'take-that-smartypants';

module.exports = TakeThatSmartypants;
