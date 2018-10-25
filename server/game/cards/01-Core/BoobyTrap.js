const Card = require('../../Card.js');

class BoobyTrap extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: card => !card.isOnFlank(),
                gameAction: ability.actions.damage({ amount: 4, splash: 2 })
            }
        });
    }
}

BoobyTrap.id = 'booby-trap'; // This is a guess at what the id might be - please check it!!!

module.exports = BoobyTrap;
