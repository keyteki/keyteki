const Card = require('../../Card.js');

class IyxrenuTheClever extends Card {
    // Action: Lose 1A. If you do, move all A from a creature to your pool.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.loseAmber((context) => ({ target: context.player })),
            then: {
                message: '{0} uses {1} to move all amber from {2} to their pool',
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
