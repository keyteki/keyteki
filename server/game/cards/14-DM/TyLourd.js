const Card = require('../../Card.js');

class TyLourd extends Card {
    // After your opponent discards a card from their hand, gain 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.location === 'hand' &&
                    !!context.source.controller.opponent &&
                    event.card.controller === context.source.controller.opponent
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

TyLourd.id = 'ty-lourd';

module.exports = TyLourd;
