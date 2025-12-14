const Card = require('../../Card.js');

class RenewedLife extends Card {
    // Play: Fully heal a creature. Make a token creature for each damage healed this way.
    setupCardAbilities(ability) {
        // Play: Fully heal a creature. Make a token creature for each damage healed this way.
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.heal({
                    fully: true
                })
            },
            then: {
                gameAction: ability.actions.makeTokenCreature((context) => ({
                    amount: context.preThenEvent.amount
                })),
                message:'{0} uses {1} to make {2} token creatures',
                messageArgs: (context) => [context.player, context.source. context.preThenEvent.amount] 
            }
        });
    }
}

RenewedLife.id = 'renewed-life';

module.exports = RenewedLife;
