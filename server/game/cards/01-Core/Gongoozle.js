const Card = require('../../Card.js');

class Gongoozle extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.dealDamage({ amount: 3 }),
                    ability.actions.conditional((context) => ({
                        condition: () => context.target.location === 'play area',
                        trueGameAction: ability.actions.discardAtRandom({
                            target: context.target.owner
                        })
                    }))
                ])
            },
            effect: 'deal 3 damage to {0}'
        });
    }
}

Gongoozle.id = 'gongoozle';

module.exports = Gongoozle;
