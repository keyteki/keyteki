const Card = require('../../Card.js');

class Aemberheart extends Card {
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
            effect: 'exalt, ward and fully heal {0}'
        });
    }
}

Aemberheart.id = 'æmberheart';

module.exports = Aemberheart;
