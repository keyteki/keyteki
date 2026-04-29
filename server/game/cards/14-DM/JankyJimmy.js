const Card = require('../../Card.js');

class JankyJimmy extends Card {
    // After Fight: If you are overwhelmed, an enemy creature captures 1
    // from its own side. Otherwise, capture 1.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.conditional((context) => ({
                condition: context.player.isOverwhelmed(),
                trueGameAction: ability.actions.capture({
                    promptForSelect: {
                        activePromptTitle: 'Choose an enemy creature to capture from its own side',
                        cardType: 'creature',
                        controller: 'opponent',
                        message: '{0} uses {1} to make {2} capture 1 amber from its own side',
                        messageArgs: (cards) => [context.player, context.source, cards]
                    },
                    player: context.player.opponent
                }),
                falseGameAction: ability.actions.capture({
                    promptForSelect: {
                        activePromptTitle: 'Choose a friendly creature to capture 1 amber',
                        cardType: 'creature',
                        controller: 'self',
                        message: '{0} uses {1} to capture 1 amber on {2}',
                        messageArgs: (cards) => [context.player, context.source, cards]
                    }
                })
            }))
        });
    }
}

JankyJimmy.id = 'janky-jimmy';

module.exports = JankyJimmy;
