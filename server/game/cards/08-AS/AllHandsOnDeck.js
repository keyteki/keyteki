const Card = require('../../Card.js');

class AllHandsOnDeck extends Card {
    // Play: If you are haunted, destroy a creature. Otherwise, deal
    // 3D to a creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional({
                condition: (context) => context.player.isHaunted(),
                trueGameAction: ability.actions.destroy((context) => ({
                    promptForSelect: {
                        cardType: 'creature',
                        message: '{0} uses {1} to destroy {2}',
                        messageArgs: (cards) => [context.player, context.source.name, cards]
                    }
                })),
                falseGameAction: ability.actions.dealDamage((context) => ({
                    amount: 3,
                    promptForSelect: {
                        cardType: 'creature',
                        message: '{0} uses {1} to deal 3 damage to {2}',
                        messageArgs: (cards) => [context.player, context.source.name, cards]
                    }
                }))
            }),
            effect: '{1}',
            effectArgs: (context) => [
                context.player.isHaunted() ? 'destroy a creature' : 'deal 3 damage to a creature'
            ]
        });
    }
}

AllHandsOnDeck.id = 'all-hands-on-deck';

module.exports = AllHandsOnDeck;
