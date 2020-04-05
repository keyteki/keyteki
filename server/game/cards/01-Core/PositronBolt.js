const Card = require('../../Card.js');

class PositronBolt extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: card => card.isOnFlank(),
                gameAction: ability.actions.dealDamage({ amount: 3 })
            },
            then: preThenContext => ({
                alwaysTrigger: preThenContext.target.neighbors.length > 0,
                target: {
                    cardType: 'creature',
                    cardCondition: card => preThenContext.target.neighbors.includes(card) && card !== preThenContext.target,
                    gameAction: ability.actions.dealDamage({ amount: 2 })
                },
                then: preThenContextNext => ({
                    alwaysTrigger: preThenContext.target.neighbors.length > 0,
                    target: {
                        cardType: 'creature',
                        cardCondition: card => preThenContextNext.target.neighbors.includes(card) && card !== preThenContextNext.target && card !== preThenContext.target,
                        gameAction: ability.actions.dealDamage({ amount: 1 })
                    }
                })
            })
        });
    }
}

PositronBolt.id = 'positron-bolt';

module.exports = PositronBolt;
