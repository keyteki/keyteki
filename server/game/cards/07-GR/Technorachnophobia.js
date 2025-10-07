import Card from '../../Card.js';

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
                        .reduce((obj, str) => {
                            if (obj === true) {
                                return true;
                            }
                            obj[str] = (obj[str] || 0) + 1;
                            return obj[str] >= 5 ? true : obj;
                        }, {}) === true,
                gameAction: ability.actions.steal({
                    amount: 2
                })
            }
        });
    }
}

Technorachnophobia.id = 'technorachnophobia';

export default Technorachnophobia;
