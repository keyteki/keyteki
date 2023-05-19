const Card = require('../../Card.js');

class FrostGiant extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.doesNotReady()
        });
    }
}

FrostGiant.id = 'frost-giant';

module.exports = FrostGiant;
