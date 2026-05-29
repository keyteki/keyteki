const Card = require('../../Card.js');

class ReduceReuse extends Card {
    // Play: If you are haunted, deal 5 damage to a creature. Otherwise, return a creature to its owner's hand.
    setupCardAbilities(ability) {
        this.play({
            preferActionPromptMessage: true,
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.isHaunted(),
                trueGameAction: ability.actions.dealDamage((context) => ({
                    amount: 5,
                    promptForSelect: {
                        cardType: 'creature',
                        message: '{0} uses {1} to deal 5 damage to {2}',
                        messageArgs: (cards) => [context.player, context.source, cards]
                    }
                })),
                falseGameAction: ability.actions.returnToHand((context) => ({
                    promptForSelect: {
                        cardType: 'creature',
                        message: "{0} uses {1} to return {2} to its owner's hand",
                        messageArgs: (cards) => [context.player, context.source, cards]
                    }
                }))
            })
        });
    }
}

ReduceReuse.id = 'reduce-reuse';

module.exports = ReduceReuse;
