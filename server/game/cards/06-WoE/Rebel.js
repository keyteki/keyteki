const TokenCard = require('../../TokenCard.js');

class Rebel extends TokenCard {
    //Reap: Deal 1D to a creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 1 })
            }
        });
    }
}

Rebel.id = 'rebel';

module.exports = Rebel;
