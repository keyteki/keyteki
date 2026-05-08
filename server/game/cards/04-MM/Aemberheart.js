const Card = require('../../Card.js');

class Amberheart extends Card {
    // Action: Exalt, ward, and fully heal a friendly creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: [
                    ability.actions.exalt(),
                    ability.actions.ward(),
                    ability.actions.heal({ fully: true })
                ]
            },
            effect: 'exalt, ward and fully heal {1}',
            effectArgs: (context) => context.target
        });
    }
}

Amberheart.id = 'æmberheart';

module.exports = Amberheart;
