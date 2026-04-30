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
            }))
        });
    }
}

JankyJimmy.id = 'janky-jimmy';

module.exports = JankyJimmy;
