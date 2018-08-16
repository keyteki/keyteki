const Card = require('../../Card.js');

class Troll extends Card {
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.heal({ amount: 3 })
        });
    }
}

Troll.id = 'troll'; // This is a guess at what the id might be - please check it!!!

module.exports = Troll;
