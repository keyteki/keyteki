const Card = require('../../Card.js');

class ThirdOfCliff extends Card {
    // Action: If your red key is forged, destroy each enemy flank
    // creature. Otherwise, destroy an enemy flank creature.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => !!context.player.opponent,
            gameAction: ability.actions.conditional((context) => ({
                condition: (context) => context.player.keys.red,
                trueGameAction: ability.actions.destroy({
                    target: context.player.opponent.creaturesInPlay.filter((c) => c.isOnFlank())
                }),
                falseGameAction: ability.actions.destroy({
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'opponent',
                        cardCondition: (card) => card.isOnFlank(),
                        message: '{0} uses {1} to destroy {2}',
                        messageArgs: (card) => [context.player, context.source, card]
                    }
                })
            })),
            effect: 'destroy {1}',
            effectArgs: (context) =>
                context.player.keys.red
                    ? [context.player.opponent.creaturesInPlay.filter((c) => c.isOnFlank())]
                    : 'an enemy flank creature'
        });
    }
}

ThirdOfCliff.id = 'third-of-cliff';

module.exports = ThirdOfCliff;
