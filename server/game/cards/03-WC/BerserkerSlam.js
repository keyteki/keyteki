const Card = require('../../Card.js');

class BerserkerSlam extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: card => card.isOnFlank(),
                gameAction: ability.actions.dealDamage({ amount: 4 })
            },
            then: {
                condition: context => context.preThenEvent.destroyed && !context.preThenEvent.redirectApplied,
                message: '{0} uses {1} to cause {3} to lose 1 aember',
                messageArgs: context => [context.preThenEvent.card.controller],
                gameAction: ability.actions.loseAmber(context => ({
                    amount: 1,
                    target: context.preThenEvent.card.controller
                }))
            }
        });
    }
}

BerserkerSlam.id = 'berserker-slam';

module.exports = BerserkerSlam;
