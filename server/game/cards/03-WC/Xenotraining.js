const Card = require('../../Card.js');

class Xenotraining extends Card {
    // Play: For each house represented among friendly creatures, a friendly creature captures 1.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent && context.player.opponent.amber > 0,
            effect: 'capture 1 amber on a friendly creature for each house represented by friendly creatures',
            gameAction: ability.actions.allocateCapture((context) => ({
                numAmber: Math.min(
                    context.player.opponent.amber,
                    context.game.getHousesInPlay(context.player.creaturesInPlay).length
                ),
                controller: 'self',
                menuTitle: 'Choose a creature to capture 1 amber'
            }))
        });
    }
}

Xenotraining.id = 'xenotraining';

module.exports = Xenotraining;
