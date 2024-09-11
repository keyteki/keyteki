const Card = require('../../Card.js');

class CirrusMace extends Card {
    // Action: Give a creature two +1 power counters. Deal 2D to each
    // of that creature’s neighbors.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature'
            },
            message: "{0} uses {1} to add two +1 power counter to {2} and deal 2 damage to {2}'s neighbors",
            messageArgs: (context) => [context.player, context.source, context.target],
            gameAction: ability.actions.addPowerCounter((context) => ({
                amount: 2,
                target: context.target
            })),
            then: (preThenContext) => ({
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: 2,
                    target: preThenContext.target.neighbors,
                }))
            })
        });
    }
}

CirrusMace.id = 'cirrus-mace';

module.exports = CirrusMace;
