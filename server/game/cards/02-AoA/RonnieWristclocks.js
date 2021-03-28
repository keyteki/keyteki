const Card = require('../../Card.js');

class RonnieWristclocks extends Card {
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
