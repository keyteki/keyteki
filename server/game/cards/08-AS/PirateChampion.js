const Card = require('../../Card.js');

class PirateChampion extends Card {
    // After Fight: You may move Pirate Champion to a flank.
    setupCardAbilities(ability) {
        this.fight({
            may: 'move this creature to a flank',
            gameAction: ability.actions.moveToFlank(),
            effect: 'optionally move {0} to a flank'
        });
    }
}

PirateChampion.id = 'pirate-champion';

module.exports = PirateChampion;
