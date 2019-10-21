const Card = require('../../Card.js');

class GuardDisguise extends Card {
    setupCardAbilities(ability) {
        this.action({
            condition: context => context.player.opponent && context.player.opponent.amber <= 3,
            gameAction: [
                ability.actions.steal({ amount: 3 }),
                ability.actions.sacrifice()
            ]
        });
    }
}

GuardDisguise.id = 'guard-disguise';

module.exports = GuardDisguise;
