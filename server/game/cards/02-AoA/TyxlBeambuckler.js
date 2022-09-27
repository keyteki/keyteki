const Card = require('../../Card.js');

class TyxlBeambuckler extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 2 damage to {1} and move it to a flank',
            effectArgs: (context) => context.target,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({
                    amount: 2
                })
            },
            then: (context) => ({
                gameAction: ability.actions.moveToFlank({ target: context.target })
            })
        });
    }
}

TyxlBeambuckler.id = 'tyxl-beambuckler';

module.exports = TyxlBeambuckler;
