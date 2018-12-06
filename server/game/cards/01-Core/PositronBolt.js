const Card = require('../../Card.js');

class PositronBolt extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: card => card.isOnFlank(),
                gameAction: [
                    ability.actions.dealDamage({ amount: 3 }),
                    ability.actions.dealDamage(context => ({
                        target: context.target.neighbors,
                        amount: 2
                    })),
                    ability.actions.dealDamage(context => {
                        let neighbor = context.target.neighbors[0];
                        if(!neighbor || neighbor.neighbors.length < 2) {
                            return { amount: 0 };
                        }
                        return {
                            target: neighbor.neighbors.find(card => card !== context.target),
                            amount: 1
                        };
                    })
                ]
            },
            effect: 'deal 3 damage to {0}{1}{2}{3}{4}',
            effectArgs: context => {
                let neighbor = context.target.neighbors[0];
                if(!neighbor) {
                    return [];
                } else if(neighbor.neighbors.length < 2) {
                    return [' and 2 damage to ', neighbor];
                }
                return [', 2 damage to ', neighbor, ' and 1 damage to ', neighbor.neighbors.find(card => card !== context.target)];
            }
        });
    }
}

PositronBolt.id = 'positron-bolt'; // This is a guess at what the id might be - please check it!!!

module.exports = PositronBolt;
