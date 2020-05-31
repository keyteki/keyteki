const Card = require('../../Card.js');

class Gamgee extends Card {
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) =>
                context.player.opponent && context.player.amber < context.player.opponent.amber,
            gameAction: ability.actions.steal()
        });
    }
}

Gamgee.id = 'gamgee';

module.exports = Gamgee;
