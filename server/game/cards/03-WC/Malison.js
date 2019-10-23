const Card = require('../../Card.js');

class Malison extends Card {
    setupCardAbilities(ability) {
        this.fight({
            target: context => ({
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.moveOnBattleline()
            })
        });
    }
}

Malison.id = 'malison';

module.exports = Malison;
