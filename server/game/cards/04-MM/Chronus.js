const Card = require('../../Card.js');

class Chronus extends Card {
    // Enhance RR. (These icons have already been added to cards in your deck.)
    // After you resolve a R bonus icon, you may archive a card.
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
