const Card = require('../../Card.js');

class SpeedSigil extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardPlayed: (event, context) => event.card.type === 'creature' && context.game.cardsPlayed.filter(card => card.type === 'creature').length === 1
            },
            gameAction: ability.actions.ready(context => ({ target: context.event.card }))
        });
    }
}

SpeedSigil.id = 'speed-sigil';

module.exports = SpeedSigil;
