const Card = require('../../Card.js');

class Malison extends Card {
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.moveOnBattleline()
            },
            then: context => ({
                condition: () => context.target.isOnFlank(),
                gameAction: ability.actions.capture({ target: context.target, ownController: true })
            })
        });
    }
}

Malison.id = 'malison';

module.exports = Malison;
