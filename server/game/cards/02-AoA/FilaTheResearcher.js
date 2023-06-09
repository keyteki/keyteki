const Card = require('../../Card.js');

class FilaTheResearcher extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // After a creature is played adjacent to Fila the Researcher, draw a card.
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
