const Card = require('../../Card.js');

class AberrantWarpEvent extends Card {
    // Play: Discard cards from the top of your deck until you discard a
    // creature or run out of cards. If you discard a creature this way, put it
    // into play and destroy one of its neighbors. Repeat the preceding effect
    // on your opponent.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => {
                let deck = context.player.deck;
                let index = deck.findIndex((card) => card.type === 'creature');
                if (index > -1) {
                    return { target: deck.slice(0, index + 1) };
                }

                return { target: deck };
            }),
            then: (context) => {
                let card = context.player.deck.find((card) => card.type === 'creature');
                if (card) {
                    context.selfPlay = card;
                    return {
                        alwaysTriggers: true,
                        message: '{0} puts {3} into play',
                        messageArgs: card,
                        gameAction: ability.actions.putIntoPlay({
                            target: card
                        }),
                        then: () => ({
                            alwaysTriggers: true,
                            target: {
                                cardType: 'creature',
                                cardCondition: (card) => card.neighbors.includes(context.selfPlay),
                                gameAction: ability.actions.destroy()
                            }
                        })
                    };
                }
            }
        });
    }
}

AberrantWarpEvent.id = 'aberrant-warp-event';

module.exports = AberrantWarpEvent;
