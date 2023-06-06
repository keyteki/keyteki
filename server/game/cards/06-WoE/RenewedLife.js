const Card = require('../../Card.js');

class RenewedLife extends Card {
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
                }))
            }
        });
    }
}

RenewedLife.id = 'renewed-life';

module.exports = RenewedLife;
