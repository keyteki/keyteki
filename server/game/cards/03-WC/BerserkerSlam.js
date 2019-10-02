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
                gameAction: ability.actions.loseAmber(context => {
                    return { amount: 1, target: context.preThenEvent.card.controller };
                })
            }
        });
    }
}

BerserkerSlam.id = 'berserker-slam';

module.exports = BerserkerSlam;
