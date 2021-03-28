const Card = require('../../Card.js');

class TooMuchToProtect extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber > 6,
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.opponent.amber - 6
            }))
        });
    }
}

TooMuchToProtect.id = 'too-much-to-protect';

module.exports = TooMuchToProtect;
