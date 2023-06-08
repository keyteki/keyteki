const Card = require('../../Card.js');

class GuardDisguise extends Card {
    // Action: Sacrifice Guard Disguise. If your opponent has 3A or fewer, steal 3A.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => context.player.opponent,
            gameAction: [
                ability.actions.steal((context) => ({
                    amount: context.player.opponent && context.player.opponent.amber <= 3 ? 3 : 0
                })),
                ability.actions.sacrifice()
            ]
        });
    }
}

GuardDisguise.id = 'guard-disguise';

module.exports = GuardDisguise;
