const Card = require('../../Card.js');

class CommanderDhrxgar extends Card {
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
