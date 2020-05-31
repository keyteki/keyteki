const Card = require('../../Card.js');

class FinchCloak extends Card {
    setupCardAbilities(ability) {
        this.triggerSteal = false;
        this.fight({
            reap: true,
            gameAction: [
                ability.actions.steal((context) => {
                    if (
                        context.player.opponent &&
                        context.player.amber < context.player.opponent.amber
                    ) {
                        this.triggerSteal = true;
                        return { amount: 1 };
                    }

                    return { amount: 0 };
                }),
                ability.actions.gainAmber((context) => {
                    if (!this.triggerSteal) {
                        return { target: context.player, amount: 1 };
                    }

                    return { target: context.player, amount: 0 };
                }),
                ability.actions.gainAmber((context) => {
                    if (!this.triggerSteal) {
                        return { target: context.player.opponent, amount: 1 };
                    }

                    return { target: context.player.opponent, amount: 0 };
                })
            ]
        });
    }
}
FinchCloak.id = 'finch-cloak';

module.exports = FinchCloak;
