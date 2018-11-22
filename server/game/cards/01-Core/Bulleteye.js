const Card = require('../../Card.js');

class Bulleteye extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                cardCondition: card => card.isOnFlank(),
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Bulleteye.id = 'bulleteye'; // This is a guess at what the id might be - please check it!!!

module.exports = Bulleteye;
