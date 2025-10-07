import Card from '../../Card.js';

class IncarnationPod extends Card {
    // Action: Choose a card in any discard pile and put it on the
    // bottom of its owner’s deck.
    //
    // Scrap: Purge the bottom card from each player's deck.
    setupCardAbilities(ability) {
        this.action({
            target: {
                location: 'discard',
                gameAction: ability.actions.returnToDeck({
                    bottom: true
                })
            }
        });

        this.scrap({
            gameAction: ability.actions.purge((context) => ({
                target: (context.player.deck.length > 0
                    ? [context.player.deck[context.player.deck.length - 1]]
                    : []
                ).concat(
                    context.player.opponent && context.player.opponent.deck.length > 0
                        ? [context.player.opponent.deck[context.player.opponent.deck.length - 1]]
                        : []
                )
            }))
        });
    }
}

IncarnationPod.id = 'incarnation-pod';

export default IncarnationPod;
