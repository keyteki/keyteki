const Card = require('../../Card.js');

class RonnieWristclocks extends Card {
    // Play: Steal 1A. If your opponent has 7A or more, steal 2A instead.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.opponent && context.player.opponent.amber < 7 ? 1 : 2
            }))
        });
    }
}

RonnieWristclocks.id = 'ronnie-wristclocks';

module.exports = RonnieWristclocks;
