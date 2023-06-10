const Card = require('../../Card.js');

class UnguardedCamp extends Card {
    // Play: For each creature you have in excess of your opponent, a friendly creature captures 1<A>. Each creature cannot capture more than 1<A> this way.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.creaturesInPlay.length >
                    context.player.opponent.creaturesInPlay.length,
            target: {
                mode: 'exactly',
                controller: 'self',
                numCards: (context) =>
                    Math.min(
                        context.player.opponent.amber,
                        context.player.creaturesInPlay.length -
                            context.player.opponent.creaturesInPlay.length
                    ),
                gameAction: ability.actions.capture()
            },
            effect: 'make {1} of their creatures capture an amber from {2}',
            effectArgs: (context) => [
                context.player.creaturesInPlay.length -
                    context.player.opponent.creaturesInPlay.length,
                context.player.opponent
            ]
        });
    }
}

UnguardedCamp.id = 'unguarded-camp';

module.exports = UnguardedCamp;
