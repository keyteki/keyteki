const Card = require('../../Card.js');

class JumpStart extends Card {
    // Play: Ready and use a friendly flank creature. If you are
    // overwhelmed, repeat the preceding effect.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            },
            effect: 'ready and use {1}',
            effectArgs: (context) => [context.target],
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.isOverwhelmed(),
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => card.isOnFlank(),
                    gameAction: ability.actions.sequential([
                        ability.actions.ready(),
                        ability.actions.use()
                    ])
                },
                message: '{0} uses {1} to repeat the preceding effect and ready and use {3}',
                messageArgs: (context) => [context.target]
            }
        });
    }
}

JumpStart.id = 'jump-start';

module.exports = JumpStart;
