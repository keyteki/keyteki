const Card = require('../../Card.js');

class Malison extends Card {
    // Fight: You may move an enemy creature anywhere in its controllers battleline. Then, if it is on a flank, it captures 1A from its own side.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.moveOnBattleline()
            },
            effect: 'move {1} in its battleline',
            effectArgs: (context) => context.target,
            then: (context) => ({
                condition: () => context.target.isOnFlank(),
                gameAction: ability.actions.capture({ target: context.target })
            })
        });
    }
}

Malison.id = 'malison';

module.exports = Malison;
