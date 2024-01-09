const Card = require('../../Card.js');

class DontBelieveYourEyes extends Card {
    // Play: If you are haunted, a creature captures 2A from its own
    // side. Otherwise, a creature captures 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.capture((context) => ({
                    amount: context.player.isHaunted() ? 2 : 1,
                    player: context.target.controller
                }))
            }
        });
    }
}

DontBelieveYourEyes.id = 'don-t-believe-your-eyes';

module.exports = DontBelieveYourEyes;
