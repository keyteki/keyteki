const Card = require('../../Card.js');

class DontBelieveYourEyes extends Card {
    // Play: If you are haunted, a creature captures 2A from its own
    // side. Otherwise, a creature captures 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.capture((context) => ({
                    allowNoAmber: true,
                    amount: context.player.isHaunted() ? 2 : 1,
                    player: context.player.isHaunted()
                        ? context.target.controller
                        : context.target.controller.opponent
                }))
            }
        });
    }
}

DontBelieveYourEyes.id = 'don-t-believe-your-eyes';

module.exports = DontBelieveYourEyes;
