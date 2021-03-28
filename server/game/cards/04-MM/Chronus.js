const Card = require('../../Card.js');

class Chronus extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            optional: true,
            when: {
                onDrawCards: (event, context) =>
                    !!event.bonus && event.player === context.source.controller
            },
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.archive()
            }
        });
    }
}

Chronus.id = 'chronus';

module.exports = Chronus;
