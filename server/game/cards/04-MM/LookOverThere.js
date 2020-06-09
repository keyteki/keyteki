const Card = require('../../Card.js');

class LookOverThere extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.dealDamage({ amount: 2 }),
                    ability.actions.conditional((context) => ({
                        condition: () => context.target.location === 'play area',
                        trueGameAction: ability.actions.steal()
                    }))
                ])
            },
            effect: 'deal 2 damage to {0}'
        });
    }
}

LookOverThere.id = 'look-over-there';

module.exports = LookOverThere;
