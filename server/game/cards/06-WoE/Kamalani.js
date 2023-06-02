const Card = require('../../Card.js');

class Kamalani extends Card {
    //Destroyed: Make 2 token creatures.
    setupCardAbilities(ability) {
        this.destroyed({
            gameAction: ability.actions.makeTokenCreature({ amount: 2 })
        });
    }
}

Kamalani.id = 'kamalani';

module.exports = Kamalani;
