const Card = require('../../Card.js');

class FilaTheResearcher extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event) => event.card.neighbors.includes(this)
            },
            gameAction: ability.actions.draw()
        });
    }
}

FilaTheResearcher.id = 'fila-the-researcher';

module.exports = FilaTheResearcher;
