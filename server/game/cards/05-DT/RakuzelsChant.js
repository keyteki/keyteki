const Card = require('../../Card.js');

class RakuzelsChant extends Card {
    // (T) Play: Exhaust a creature. If the tide is high, exhaust each creature instead.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional((context) => ({
                condition: () => context.player.isTideHigh(),
                trueGameAction: ability.actions.exhaust({
                    target: context.game.creaturesInPlay
                }),
                falseGameAction: ability.actions.exhaust({
                    promptForSelect: {
                        cardType: 'creature',
                        message: '{0} uses {1} to exhaust {2}',
                        messageArgs: (card) => [context.player, context.source, card]
                    }
                })
            })),
            effect: '{1}',
            effectArgs: (context) =>
                context.player.isTideHigh() ? 'exhaust each creature' : 'exhaust a creature'
        });
    }
}

RakuzelsChant.id = 'rakuzel-s-chant';

module.exports = RakuzelsChant;
