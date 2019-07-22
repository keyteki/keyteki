const Card = require('../../Card.js');

class Duskwitch extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'creature' && context.game.cardsPlayed.filter(card => card.controller === context.player && card.type === 'creature').length === 1
            },
            gameAction: ability.actions.ready(context => ({ target: context.event.card }))
        });
    }
}

Duskwitch.id = 'duskwitch';

module.exports = Duskwitch;
