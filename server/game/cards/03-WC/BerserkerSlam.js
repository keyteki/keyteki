const Card = require('../../Card.js');

class BerserkerSlam extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.dealDamage({ amount: 4 })
            },
            then: (preThenContext) => ({
                condition: () => preThenContext.target.location !== 'play area',
                message: '{0} uses {1} to cause {3} to lose 1 amber',
                messageArgs: (context) => [context.preThenEvent.clone.controller],
                gameAction: ability.actions.loseAmber((context) => ({
                    amount: 1,
                    target: context.preThenEvent.clone.controller
                }))
            })
        });
    }
}

BerserkerSlam.id = 'berserker-slam';

module.exports = BerserkerSlam;
