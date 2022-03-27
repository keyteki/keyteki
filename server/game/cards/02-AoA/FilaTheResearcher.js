const Card = require('../../Card.js');

class FilaTheResearcher extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, context) => event.card.neighbors.includes(context.source)
            },
            gameAction: ability.actions.draw()
        });
    }
}

FilaTheResearcher.id = 'fila-the-researcher';

module.exports = FilaTheResearcher;
