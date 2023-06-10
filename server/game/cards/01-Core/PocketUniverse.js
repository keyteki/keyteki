const Card = require('../../Card.js');

class PocketUniverse extends Card {
    // You may spend A on Pocket Universe when forging keys.
    // Action: Move 1A from your pool to Pocket Universe.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.keyAmber()
        });

        this.action({
            cost: ability.costs.loseAmber(),
            gameAction: ability.actions.placeAmber()
        });
    }
}

PocketUniverse.id = 'pocket-universe';

module.exports = PocketUniverse;
