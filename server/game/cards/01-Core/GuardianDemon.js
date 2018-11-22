const Card = require('../../Card.js');

class GuardianDemon extends Card {
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 2 }) // TODO allow player to pick 1 damage if they want
            },
            then: context => ({
                target: {
                    cardType: 'creature',
                    cardCondition: card => card !== context.target,
                    gameAction: ability.actions.dealDamage(context => ({ amount: context.preThenEvent.amount }))
                },
                message: '{0} uses {1} to deal {3} damage to {2}',
                messageArgs: context => context.preThenEvent.amount
            })
        });
    }
}

GuardianDemon.id = 'guardian-demon'; // This is a guess at what the id might be - please check it!!!

module.exports = GuardianDemon;
