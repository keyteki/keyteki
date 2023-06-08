const Card = require('../../Card.js');

class Symon extends Card {
    // Skirmish. (When you use this creature to fight, it is dealt no damage in return.)
    // Fight: Put the creature Symon fights on top of its owners deck.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.returnToDeck((context) => ({
                target: context.event.card.location === 'play area' ? context.event.card : []
            }))
        });
    }
}

Symon.id = 'symon';

module.exports = Symon;
