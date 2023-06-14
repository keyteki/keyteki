const Card = require('../../Card.js');

class Xenotraining extends Card {
    // Play: For each house represented among friendly creatures, a friendly creature captures 1.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent && context.player.opponent.amber > 0,
            effect:
                'capture 1 amber on a friendly creature for each house represented by friendly creatures',
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: Math.min(
                    context.player.opponent.amber,
                    context.game.getHousesInPlay(this.controller.creaturesInPlay).length
                ),
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

Xenotraining.id = 'xenotraining';

module.exports = Xenotraining;
