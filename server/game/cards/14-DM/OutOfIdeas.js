const Card = require('../../Card.js');

class OutOfIdeas extends Card {
    // Play: Shuffle Out of Ideas and the top card of your discard pile
    // into their owner's deck.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToDeck((context) => ({
                shuffle: true,
                target: [context.source].concat(
                    context.player.discard.length > 0 ? [context.player.discard[0]] : []
                )
            })),
            effect: "shuffle {1} and the top card of {2}'s discard pile into their owner's deck",
            effectArgs: (context) => [context.source, context.player]
        });
    }
}

OutOfIdeas.id = 'out-of-ideas';

module.exports = OutOfIdeas;
