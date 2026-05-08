const Card = require('../../Card.js');

class Lyylyug extends Card {
    // Elusive.
    // After Reap: The least powerful enemy creature captures 1A from its own side.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                mode: 'leastStat',
                cardType: 'creature',
                controller: 'opponent',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.capture({ amount: 1 })
            }
        });
    }
}

Lyylyug.id = 'lyylyug';

module.exports = Lyylyug;
