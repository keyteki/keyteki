const Card = require('../../Card.js');

class BaitAndSwitch extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.amber < context.player.opponent.amber,
            gameAction: ability.actions.steal(),
            then: (context) => ({
                condition: () => context.player.amber < context.player.opponent.amber,
                gameAction: ability.actions.steal(),
                message: '{0} uses {1} to steal an additional amber'
            })
        });
    }
}

BaitAndSwitch.id = 'bait-and-switch';

module.exports = BaitAndSwitch;
