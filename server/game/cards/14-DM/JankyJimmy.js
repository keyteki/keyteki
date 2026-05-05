const Card = require('../../Card.js');

class JankyJimmy extends Card {
    // After Fight: If you are overwhelmed, an enemy creature captures 1A from its own side. Otherwise, capture 1A.
    setupCardAbilities(ability) {
        this.fight({
            preferActionPromptMessage: true,
            gameAction: ability.actions.conditional((context) => ({
                condition: context.player.isOverwhelmed(),
                trueGameAction: ability.actions.capture({
                    promptForSelect: {
                        cardType: 'creature',
                        controller: 'opponent',
                        message: '{0} uses {1} to make {2} capture 1 amber from its own side',
                        messageArgs: (cards) => [context.player, context.source, cards]
                    },
                    player: context.player.opponent
                }),
                falseGameAction: ability.actions.capture((context) => ({
                    target: context.source
                }))
            })),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: () => !preThenContext.player.isOverwhelmed(),
                message: '{0} uses {1} to capture 1 amber'
            })
        });
    }
}

JankyJimmy.id = 'janky-jimmy';

module.exports = JankyJimmy;
