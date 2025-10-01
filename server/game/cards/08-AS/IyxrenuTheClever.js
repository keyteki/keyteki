const Card = require('../../Card.js');

class IyxrenuTheClever extends Card {
    // Action: Lose 1A. If you do, move all A from a creature to your pool.
    setupCardAbilities(ability) {
        this.action({
            message: '{0} uses {1} to lose {2} amber',
            messageArgs: (context) => [
                context.player,
                context.source,
                Math.min(1, context.player.amber)
            ],
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player
            })),
            then: {
                message: '{0} uses {1} to move all {3} amber from {2} to their pool',
                messageArgs: (context) => [context.target.tokens.amber || 0],
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.returnAmber((context) => ({
                        all: true,
                        recipient: context.player
                    }))
                }
            }
        });
    }
}

IyxrenuTheClever.id = 'iyxrenu-the-clever';

module.exports = IyxrenuTheClever;
