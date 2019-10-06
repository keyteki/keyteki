const Card = require('../../Card.js');

class TitanGuardian extends Card {
    setupCardAbilities(ability) {
        this.destroyed({
            condition: () => !this.isOnFlank(),
            effect: 'draw 2 cards',
            gameAction: ability.actions.draw({
                amount: 2
            })
        });
    }
}

TitanGuardian.id = 'titan-guardian';

module.exports = TitanGuardian;
