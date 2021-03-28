const Card = require('../../Card.js');

class BoobyTrap extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => !card.isOnFlank(),
                gameAction: ability.actions.dealDamage({ amount: 4, splash: 2 })
            }
        });
    }
}

BoobyTrap.id = 'booby-trap';

module.exports = BoobyTrap;
