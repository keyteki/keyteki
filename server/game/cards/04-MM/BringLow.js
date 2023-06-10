const Card = require('../../Card.js');

class BringLow extends Card {
    // Enhance . (These icons have already been added to cards in your deck.)
    // Play: Capture all but 5 of your opponents , distributed among any number of friendly creatures.
    setupCardAbilities(ability) {
        this.play({
            effect: 'have friendly creatures capture {1} amber from {2}',
            effectArgs: (context) => [
                context.player.opponent ? Math.max(context.player.opponent.amber - 5, 0) : 0,
                context.player.opponent
            ],
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.player.opponent ? Math.max(context.player.opponent.amber - 5, 0) : 0,
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
