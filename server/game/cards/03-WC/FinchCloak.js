const Card = require('../../Card.js');

class FinchCloak extends Card {
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            gameAction: ability.actions.conditional((context) => ({
                target: context.player,
                condition: (context) =>
                    context.player.opponent && context.player.amber < context.player.opponent.amber,
                trueGameAction: ability.actions.steal({ amount: 1 }),
                falseGameAction: ability.actions.sequential([
                    ability.actions.gainAmber({
                        amount: 1
                    }),
                    ability.actions.gainAmber((context) => ({
                        target: context.player.opponent,
                        amount: 1
                    }))
                ])
            })),
            effect: '{1}',
            effectArgs: (context) =>
                context.player.amber < context.player.opponent.amber
                    ? 'steal 1 amber'
                    : 'make both players gain 1 amber'
        });
    }
}
FinchCloak.id = 'finch-cloak';

module.exports = FinchCloak;
