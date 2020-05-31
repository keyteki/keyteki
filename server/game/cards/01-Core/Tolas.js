const Card = require('../../Card.js');

class Tolas extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event) =>
                    event.card.type === 'creature' && event.card.controller.opponent
            },
            gameAction: ability.actions.gainAmber((context) => ({
                target: context.event.card.controller.opponent
            }))
        });
    }
}

Tolas.id = 'tolas';

module.exports = Tolas;
