const Card = require('../../Card.js');

class PocketUniverse extends Card {
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
