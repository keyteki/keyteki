const Card = require('../../Card.js');

class BringLow extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'have friendly creatures capture {1} amber from {2}',
            effectArgs: (context) => [
                Math.max(context.player.opponent.amber - 5, 0),
                context.player.opponent
            ],
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: Math.max(context.player.opponent.amber - 5, 0),
                action: ability.actions.capture({
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to capture 1 amber',
                        cardType: 'creature',
                        controller: 'self'
                    }
                })
            }))
        });
    }
}

BringLow.id = 'bring-low';

module.exports = BringLow;
