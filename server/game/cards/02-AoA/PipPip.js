const Card = require('../../Card.js');

class PipPip extends Card {
    // After an enemy creature reaps, stun it.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) =>
                    event.card.type === 'creature' &&
                    event.card.controller !== context.source.controller
            },
            gameAction: ability.actions.stun((context) => ({
                target: context.event.card
            }))
        });
    }
}

PipPip.id = 'pip-pip';

module.exports = PipPip;
