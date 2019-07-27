const Card = require('../../Card.js');

class TyxlBeambuckler extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'Deal 2 damage to a creature and move it to either flank of its controller’s battleline.',
            target: {
                cardType: 'creature',
                gameAction: [ability.actions.dealDamage({
                    amount: 2
                }),
                ability.actions.moveToFlank()
                ]
            }
        });
    }
}

TyxlBeambuckler.id = 'tyxl-beambuckler';

module.exports = TyxlBeambuckler;
