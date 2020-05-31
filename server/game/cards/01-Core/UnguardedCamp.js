const Card = require('../../Card.js');

class UnguardedCamp extends Card {
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
