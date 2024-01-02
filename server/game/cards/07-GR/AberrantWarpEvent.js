const Card = require('../../Card.js');

function discard(deck) {
    const index = deck.findIndex((card) => card.type === 'creature');
    if (index > -1) {
        return { target: deck.slice(0, index + 1) };
    }

    return { target: deck };
}

class AberrantWarpEvent extends Card {
    // Play: Discard cards from the top of your deck until you discard a
    // creature or run out of cards. If you discard a creature this way, put it
    // into play and destroy one of its neighbors. Repeat the preceding effect
    // on your opponent.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => discard(context.player.deck)),
            then: (context) => {
                const card = context.player.deck.find((card) => card.type === 'creature');
                if (card) {
                    context.playedCard = card;
                    return {
                        alwaysTriggers: true,
                        message: '{0} uses {1} to put {3} into play',
                        messageArgs: card,
                        gameAction: ability.actions.putIntoPlay({
                            target: card
                        }),
                        then: () => ({
                            alwaysTriggers: true,
                            message: '{0} uses {1} to destroy 2{2}3{3}4{4}', // {3} is empty
                            messageArgs: (ctx) => {
                                console.log(ctx.targets);
                                return [ctx.targets, ['this', 'that'], 'bla'];
                            },
                            gameAction: ability.actions.destroy(() => ({
                                target: card.controller.creaturesInPlay.filter((card) =>
                                    card.neighbors.includes(context.playedCard)
                                )
                            }))
                        })
                    };
                }
            }
        });
    }
}

AberrantWarpEvent.id = 'aberrant-warp-event';

module.exports = AberrantWarpEvent;
