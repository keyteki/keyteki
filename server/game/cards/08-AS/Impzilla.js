const Card = require('../../Card.js');

class Impzilla extends Card {
    // After Fight: Destroy the most powerful enemy creature.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                mode: 'mostStat',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Impzilla.id = 'impzilla';

module.exports = Impzilla;
