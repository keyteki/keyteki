const Card = require('../../Card.js');

class Technorachnophobia extends Card {
    // Play: Discard the top 10 cards of your deck. If you discard 5
    // or more cards of the same house this way, steal 2.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.deck.slice(0, Math.min(context.player.deck.length, 10))
            })),
            then: {
                condition: (context) =>
                    context.preThenEvents &&
                    context.preThenEvents
                        .flatMap((event) => event.card.getHouses())
                        .filter((h, i, a) => a.indexOf(h) === i) // get the list of unique houses
                        .some(
                            (h) =>
                                context.preThenEvents.reduce(
                                    (total, x) => total + (x.card.hasHouse(h) ? 1 : 0),
                                    0
                                ) >= 5
                        ), // does any house match 5 or more cards?
                gameAction: ability.actions.steal({
                    amount: 2
                })
            }
        });
    }
}

Technorachnophobia.id = 'technorachnophobia';

module.exports = Technorachnophobia;
