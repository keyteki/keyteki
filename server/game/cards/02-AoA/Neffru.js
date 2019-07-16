const Card = require('../../Card.js');

class Neffru extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event) => event.clone.type === 'creature'
            },
            gameAction: ability.actions.gainAmber(context => ({ target: context.event.card.controller }))
        });
    }
}

Neffru.id = 'neffru';

module.exports = Neffru;
