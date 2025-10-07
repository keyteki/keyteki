import Card from '../../Card.js';

class ShoppingSpree extends Card {
    // Play: Discard your hand. Draw a card for each card discarded
    // this way.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.hand
            })),
            then: {
                gameAction: ability.actions.draw((context) => {
                    const events = context.preThenEvents || [];
                    const cards = events.flatMap((e) =>
                        (Array.isArray(e.cards) ? e.cards : []).concat(e.card ? [e.card] : [])
                    );
                    const amount = cards.length || events.length;
                    return { amount };
                })
            }
        });
    }
}

ShoppingSpree.id = 'shopping-spree';

export default ShoppingSpree;
