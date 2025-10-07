import Card from '../../Card.js';

class CirrusMace extends Card {
    // Action: Give a creature two +1 power counters. Deal 2D to each
    // of that creature’s neighbors.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.addPowerCounter((context) => ({
                    amount: 2,
                    target: context.target
                }))
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.dealDamage({
                    amount: 2,
                    target: preThenContext.target ? preThenContext.target.neighbors : []
                }),
                message: "{0} uses {1} to deal 2 damage to {3}'s neighbors",
                messageArgs: [preThenContext.target]
            })
        });
    }
}

CirrusMace.id = 'cirrus-mace';

export default CirrusMace;
