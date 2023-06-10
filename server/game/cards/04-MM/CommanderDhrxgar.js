const Card = require('../../Card.js');

class CommanderDhrxgar extends Card {
    // After an upgrade is attached to Commander Dhrxgar or 1 of its neighbors, gain 1.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardAttached: (event, context) =>
                    event.card.parent === context.source ||
                    context.source.neighbors.includes(event.card.parent)
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

CommanderDhrxgar.id = 'commander-dhrxgar';

module.exports = CommanderDhrxgar;
