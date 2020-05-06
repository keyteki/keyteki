const Card = require('../../Card.js');

class Duskwitch extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => 
                    event.card.type === 'creature' && event.card.controller === context.player && event.card !== context.source
            },
            gameAction: ability.actions.ready(context => ({ target: context.event.card }))
        });
    }
}

Duskwitch.id = 'duskwitch';

module.exports = Duskwitch;
