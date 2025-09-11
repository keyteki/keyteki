const Card = require('../../Card.js');

class Scaethe extends Card {
    // Destroyed: Destroy the least powerful enemy creature.
    setupCardAbilities(ability) {
        this.destroyed({
            target: {
                mode: 'leastStat',
                cardType: 'creature',
                controller: 'opponent',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Scaethe.id = 'scaethe';

module.exports = Scaethe;
